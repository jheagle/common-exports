import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { makeCommon } from './main'
import { setUp } from 'test-filesystem'

// A small, fast, fully-synthetic fixture for reproducing/validating the recursive-conversion race condition,
// deliberately avoiding any real npm package (like gulp-imagemin) - this needs to stay cheap to iterate on.
const tempDir = 'test-race-condition/'
const modulesPath = `${tempDir}node_modules`
const vendorPath = `${tempDir}external-modules`

setUp.setDefaults(tempDir)

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

const DEPTH = 30

/**
 * Build a chain of DEPTH packages, each nested inside the previous one's own node_modules (mirroring how npm
 * nests non-deduped dependencies), where each one imports the next by bare name. This is the same shape as the
 * real execa -> human-signals -> ... chain that originally surfaced the race condition.
 * @returns {{entryFile: string, packagePaths: Array<string>}}
 */
const buildChain = () => {
  const packagePaths = []
  let currentDir = modulesPath
  for (let level = 0; level < DEPTH; level++) {
    const packageName = `pkg${level}`
    const packageDir = `${currentDir}/${packageName}`
    mkdirSync(packageDir, { recursive: true })
    const isLeaf = level === DEPTH - 1
    const content = isLeaf
      ? 'export const value = \'leaf\'\n'
      : `import { value } from 'pkg${level + 1}'\nexport { value }\n`
    writeFileSync(`${packageDir}/index.js`, content)
    packagePaths.push(packageDir)
    currentDir = `${packageDir}/node_modules`
  }
  return { entryFile: `${packagePaths[0]}/index.js`, packagePaths }
}

/**
 * Build a fan-out fixture: an entry file that imports BREADTH sibling packages at once (mirroring
 * gulp-imagemin's own getDefaultPlugins, which loads several plugins together via Promise.all), each of which
 * itself imports 2 more nested siblings.
 * @returns {{entryFile: string, siblingDirs: Array<string>}}
 */
const BREADTH = 6
const buildFanOut = () => {
  const entryDir = `${modulesPath}/entry`
  mkdirSync(entryDir, { recursive: true })
  const siblingImports = []
  const siblingDirs = []
  for (let branch = 0; branch < BREADTH; branch++) {
    const siblingDir = `${modulesPath}/sibling${branch}`
    mkdirSync(`${siblingDir}/node_modules`, { recursive: true })
    for (let leaf = 0; leaf < 2; leaf++) {
      const leafDir = `${siblingDir}/node_modules/leaf${leaf}`
      mkdirSync(leafDir, { recursive: true })
      writeFileSync(`${leafDir}/index.js`, `export const value = 'leaf${branch}-${leaf}'\n`)
    }
    writeFileSync(
      `${siblingDir}/index.js`,
      'import { value as a } from \'leaf0\'\n' +
      'import { value as b } from \'leaf1\'\n' +
      'export { a, b }\n'
    )
    siblingImports.push(`import { a as v${branch} } from 'sibling${branch}'`)
    siblingDirs.push(siblingDir)
  }
  writeFileSync(
    `${entryDir}/index.js`,
    siblingImports.join('\n') + '\n' + `export { ${siblingImports.map((_, i) => `v${i}`).join(', ')} }\n`
  )
  return { entryFile: `${entryDir}/index.js`, siblingDirs }
}

/**
 * Build a package whose package.json says "type": "module" (as most modern packages do) but whose actual
 * resolved main file is a .cjs file - Node's own resolution lets a file's own extension override the package's
 * declared type, so a .cjs file is always CommonJS regardless. This is the exact shape of the real
 * fast-equals@5.4.2 package (a dependency of `ow`, itself a dependency of `imagemin`) that originally caused an
 * unbounded, OOM-crashing loop: it was misclassified as needing conversion, and its destination path computation
 * (which only recognized .js/.mjs) failed to strip the filename, writing into a path like
 * ".../fast-equals/dist/cjs/index.cjs/index.js" - treating the .cjs FILE as if it were a directory.
 * @returns {{entryFile: string}}
 */
const buildCjsMainFixture = () => {
  const packageDir = `${modulesPath}/fast-equals-like`
  mkdirSync(`${packageDir}/dist/cjs`, { recursive: true })
  writeFileSync(
    `${packageDir}/package.json`,
    JSON.stringify({
      name: 'fast-equals-like',
      type: 'module',
      main: './dist/cjs/index.cjs',
      exports: { '.': { require: { default: './dist/cjs/index.cjs' }, default: './dist/es/index.mjs' } }
    })
  )
  writeFileSync(`${packageDir}/dist/cjs/index.cjs`, 'module.exports.value = \'cjs-leaf\'\n')
  const entryDir = `${modulesPath}/cjs-consumer`
  mkdirSync(entryDir, { recursive: true })
  writeFileSync(`${entryDir}/index.js`, 'import { value } from \'fast-equals-like\'\nexport { value }\n')
  return { entryFile: `${entryDir}/index.js` }
}

/**
 * Build a package whose entry point is already plain CommonJS (no import/export syntax at all) with its own
 * privately-nested dependency, mirroring imagemin-pngquant's real shape: a package that needs no ESM conversion
 * at all, whose own require() calls into its own node_modules would otherwise never get discovered (findImports
 * only scans for import/export syntax) or copied along, silently relying on the real environment happening to
 * have a compatible version installed instead of this package's own private, pinned copy.
 * @returns {{entryFile: string}}
 */
const buildAlreadyCommonEntryFixture = () => {
  const packageDir = `${modulesPath}/already-cjs-entry`
  const privateDepDir = `${packageDir}/node_modules/private-dep`
  mkdirSync(privateDepDir, { recursive: true })
  writeFileSync(`${privateDepDir}/index.js`, 'module.exports = \'private-dep-value\'\n')
  writeFileSync(
    `${packageDir}/index.js`,
    '\'use strict\';\nconst privateDep = require(\'private-dep\');\nmodule.exports = privateDep;\n'
  )
  return { entryFile: `${packageDir}/index.js` }
}

/**
 * Build a package whose privately-nested, already-common sibling ("common-sibling") sits in the same
 * node_modules folder as an ESM sibling ("esm-sibling") that also gets individually, directly imported and
 * converted. Reproduces the real bug found via the gulp-imagemin fork: common-sibling's own isCommon wholesale
 * copy (needed so it can resolve *its own* siblings via relative paths) carries along esm-sibling's original,
 * unconverted package.json as a side effect, even though esm-sibling's own .js content gets separately,
 * correctly converted to CommonJS via the direct import below - leaving valid CJS content sitting next to a
 * package.json that still says "type": "module".
 * @returns {{entryFile: string}}
 */
const buildStrayTypeModuleFixture = () => {
  const consumerDir = `${modulesPath}/consumer`
  const nestedModules = `${consumerDir}/node_modules`
  const commonSiblingDir = `${nestedModules}/common-sibling`
  const esmSiblingDir = `${nestedModules}/esm-sibling`
  mkdirSync(commonSiblingDir, { recursive: true })
  mkdirSync(esmSiblingDir, { recursive: true })
  writeFileSync(`${commonSiblingDir}/package.json`, JSON.stringify({ name: 'common-sibling' }))
  // isCommonModule's content-based fallback (when package.json has no "type" field) specifically looks for a
  // require() call as evidence of being CommonJS - a body with no requires at all wouldn't satisfy that check.
  writeFileSync(`${commonSiblingDir}/index.js`, 'require(\'fs\')\nmodule.exports = \'common-sibling-value\'\n')
  writeFileSync(`${esmSiblingDir}/package.json`, JSON.stringify({ name: 'esm-sibling', type: 'module' }))
  writeFileSync(`${esmSiblingDir}/index.js`, 'export const value = \'esm-sibling-value\'\n')
  writeFileSync(
    `${consumerDir}/index.js`,
    'import commonSibling from \'common-sibling\'\n' +
    'import { value } from \'esm-sibling\'\n' +
    'export { commonSibling, value }\n'
  )
  return { entryFile: `${consumerDir}/index.js` }
}

describe('makeCommon recursive conversion', () => {
  test('every level of a deep import chain is fully converted by the time the entry file reports finished', done => {
    const { entryFile } = buildChain()
    makeCommon(entryFile, `${vendorPath}/pkg0`)
      .on('finish', () => {
        // The vendor output mirrors the same nested structure as the source.
        let expectedDir = `${vendorPath}/pkg0`
        for (let level = 0; level < DEPTH; level++) {
          const expectedFile = `${expectedDir}/index.js`
          expect(existsSync(expectedFile)).toBeTruthy()
          const contents = readFileSync(expectedFile).toString()
          expect(contents).not.toMatch(/^import /m)
          expect(contents).not.toMatch(/^export /m)
          expectedDir = `${expectedDir}/node_modules/pkg${level + 1}`
        }
        done()
      })
      .on('error', error => {
        done(error)
      })
  }, 10000)

  test('every sibling branch of a fan-out import is fully converted by the time the entry file reports finished', done => {
    const { siblingDirs } = buildFanOut()
    makeCommon(`${modulesPath}/entry/index.js`, `${vendorPath}/entry`)
      .on('finish', () => {
        siblingDirs.forEach((siblingDir, branch) => {
          // sibling0..siblingN sit flat alongside entry (all direct children of modulesPath), not nested inside
          // entry's own node_modules - the vendor output mirrors that same flat relative structure.
          const siblingFile = `${vendorPath}/sibling${branch}/index.js`
          expect(existsSync(siblingFile)).toBeTruthy()
          const siblingContents = readFileSync(siblingFile).toString()
          expect(siblingContents).not.toMatch(/^import /m)
          for (let leaf = 0; leaf < 2; leaf++) {
            const leafFile = `${vendorPath}/sibling${branch}/node_modules/leaf${leaf}/index.js`
            expect(existsSync(leafFile)).toBeTruthy()
            const leafContents = readFileSync(leafFile).toString()
            expect(leafContents).not.toMatch(/^export const/m)
          }
        })
        done()
      })
      .on('error', error => {
        done(error)
      })
  }, 10000)

  test('a .cjs main file is copied as-is, not misresolved into a nested "index.cjs/index.js" path', done => {
    const { entryFile } = buildCjsMainFixture()
    makeCommon(entryFile, `${vendorPath}/cjs-consumer`)
      .on('finish', () => {
        // Copied verbatim (isCommon), not converted, and not written inside a bogus "index.cjs/" directory.
        const cjsFile = `${vendorPath}/fast-equals-like/dist/cjs/index.cjs`
        expect(existsSync(cjsFile)).toBeTruthy()
        expect(existsSync(`${cjsFile}/index.js`)).toBeFalsy()
        expect(readFileSync(cjsFile).toString()).toEqual('module.exports.value = \'cjs-leaf\'\n')
        done()
      })
      .on('error', error => {
        done(error)
      })
  }, 10000)

  test('an already-CommonJS entry point is copied wholesale, bringing its own private dependency along', done => {
    const { entryFile } = buildAlreadyCommonEntryFixture()
    makeCommon(entryFile, `${vendorPath}/already-cjs-entry`)
      .on('finish', () => {
        expect(existsSync(`${vendorPath}/already-cjs-entry/index.js`)).toBeTruthy()
        const privateDepFile = `${vendorPath}/already-cjs-entry/node_modules/private-dep/index.js`
        expect(existsSync(privateDepFile)).toBeTruthy()
        expect(readFileSync(privateDepFile).toString()).toEqual('module.exports = \'private-dep-value\'\n')
        done()
      })
      .on('error', error => {
        done(error)
      })
  }, 10000)

  test('a privately-nested common sibling\'s wholesale copy does not leave a stray "type": "module" on an ESM sibling converted alongside it', done => {
    const { entryFile } = buildStrayTypeModuleFixture()
    makeCommon(entryFile, `${vendorPath}/consumer`)
      .on('finish', () => {
        const esmSiblingDest = `${vendorPath}/consumer/node_modules/esm-sibling`
        const contents = readFileSync(`${esmSiblingDest}/index.js`).toString()
        expect(contents).not.toMatch(/^export /m)
        expect(contents).toContain('esm-sibling-value')
        const packageJson = JSON.parse(readFileSync(`${esmSiblingDest}/package.json`).toString())
        expect(packageJson.type).not.toEqual('module')
        done()
      })
      .on('error', error => {
        done(error)
      })
  }, 10000)
})
