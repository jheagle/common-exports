/* eslint-disable no-template-curly-in-string -- fixture source code, the ${...} is meant to stay literal */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { makeCommon } from './main'
import { copyRealModules, setUp } from 'test-filesystem'
import { dest, src } from 'gulp'

const tempDir = 'test-make-common/'
const modulesPath = `${tempDir}node_modules`
const vendorPath = `${tempDir}external-modules`
const srcPath = `${tempDir}src`
const browserPath = `${tempDir}browser`

const mainFileContent = 'import { dependency } from \'test-make-common/src/dependency.mjs\'\n' +
  '\n' +
  '/**\n' +
  ' * Start a new message.\n' +
  ' * @param {string} message\n' +
  ' * @return {string}\n' +
  ' */\n' +
  'export const main = (message = \'\') => {\n' +
  '  const mainMessage = \'Entered main\'\n' +
  '  if (!message) {\n' +
  '    return dependency(mainMessage)\n' +
  '  }\n' +
  '  return message + \' | \' + mainMessage\n' +
  '}\n' +
  '\n' +
  'export default main\n'

const dependencyContent = 'import { main } from \'test-make-common/src/main.mjs\'\n' +
  '\n' +
  '/**\n' +
  ' * Add some text to the incoming message.\n' +
  ' * @param {string} message\n' +
  ' * @return {string}\n' +
  ' */\n' +
  'export const dependency = (message = \'\') => {\n' +
  '  const depMessage = \'Entered dependency\'\n' +
  '  return main(message ? `${message} | ${depMessage}` : depMessage)\n' +
  '}\n' +
  '\n' +
  'export default dependency\n'

setUp.setDefaults(tempDir)

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

/**
 * Every package.json under dir that still declares "type": "module".
 * @param {string} dir
 * @return {Array<string>}
 */
const packageJsonFilesWithEsmType = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const entryPath = `${dir}/${entry.name}`
  if (entry.isDirectory()) {
    return packageJsonFilesWithEsmType(entryPath)
  }
  return entry.name === 'package.json' && JSON.parse(readFileSync(entryPath).toString()).type === 'module' ? [entryPath] : []
})

/**
 * Run the imagemin process to demonstrate that it has been converted successfully.
 * @param {Array} files
 * @param {Function} done
 * @return {stream.Stream}
 */
const imageminTest = (files, done) => {
  const imagemin = require(`../${vendorPath}/gulp-imagemin`).default
  let waiting = files.length
  for (const img of files) {
    const imagesFile = img.testPath
    cpSync(img.origin, img.testPath)
    --waiting
    // encoding: false is required for binary files (images) - vinyl-fs otherwise reads them through a lossy
    // text-encoding round-trip, corrupting the bytes. This doesn't visibly break jpg/png/svg here since their
    // "expected compressed" fixtures were themselves captured from this same corrupted-input pipeline, but
    // gifsicle's own GIF parser is strict enough to reject the corrupted input outright (rather than silently
    // tolerating it like mozjpeg/optipng/svgo do), which is what caused gif's compression step to fail.
    src(imagesFile, { encoding: false })
      .pipe(
        imagemin(
          {
            silent: true,
            verbose: false,
          }
        )
      )
      .pipe(dest(browserPath))
      .on('finish', () => {
        expect(existsSync(browserPath)).toBeTruthy()
        expect(
          readFileSync(img.newPath).toString()
        ).toEqual(
          readFileSync(img.compressed).toString()
        )
        if (waiting <= 0) {
          done()
        }
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  }
}

describe('makeCommon', () => {
  test('can convert files with circular imports', done => {
    expect.assertions(2)
    const srcFile = `${srcPath}/main.mjs`
    writeFileSync(srcFile, mainFileContent)
    writeFileSync(`${srcPath}/dependency.mjs`, dependencyContent)
    makeCommon(srcFile, browserPath)
      .on('finish', () => {
        expect(existsSync(`${browserPath}/main.js`)).toBeTruthy()
        expect(existsSync(`${browserPath}/dependency.js`)).toBeTruthy()
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  })

  test('strips "type": "module" from packages copied next to, not inside, the destination folder', done => {
    // The real shape (gulp-imagemin -> imagemin-mozjpeg -> execa): app imports the ES module package "owner", which
    // is converted next to app (dependencies are written relative to destPath: browser/app/../owner). owner imports
    // the CommonJS "common-dep" from its own private node_modules, so that whole folder is copied wholesale -
    // including an ES module sibling's package.json still saying "type": "module".
    const modules = `${srcPath}/node_modules`
    const privateModules = `${modules}/owner/node_modules`
    for (const dir of [`${modules}/app`, `${privateModules}/common-dep`, `${privateModules}/esm-sibling`]) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(`${modules}/app/package.json`, JSON.stringify({ name: 'app', type: 'module', main: 'index.js' }))
    writeFileSync(`${modules}/app/index.js`, 'import owner from \'owner\'\nexport default owner\n')
    writeFileSync(`${modules}/owner/package.json`, JSON.stringify({ name: 'owner', type: 'module', main: 'index.js' }))
    writeFileSync(`${modules}/owner/index.js`, 'import dep from \'common-dep\'\nexport default dep\n')
    // A require() call is what makes common-exports treat a package as already CommonJS (copied, not converted)
    writeFileSync(`${privateModules}/common-dep/package.json`, JSON.stringify({ name: 'common-dep', main: 'index.js' }))
    writeFileSync(`${privateModules}/common-dep/index.js`, 'module.exports = require(\'./value.js\')\n')
    writeFileSync(`${privateModules}/common-dep/value.js`, 'module.exports = 1\n')
    writeFileSync(`${privateModules}/esm-sibling/package.json`, JSON.stringify({ name: 'esm-sibling', type: 'module' }))
    writeFileSync(`${privateModules}/esm-sibling/index.js`, 'export default 2\n')
    expect.assertions(2)
    makeCommon(`${modules}/app/index.js`, `${browserPath}/app`)
      .on('finish', () => {
        expect(existsSync(`${browserPath}/owner/node_modules/esm-sibling/package.json`)).toBeTruthy()
        expect(packageJsonFilesWithEsmType(browserPath)).toEqual([])
        done()
      })
      .on('error', error => done(error))
  })

  describe('can use compiled package', () => {
    const testFileConversions = [
      {
        type: 'gif',
        files: [{
          origin: 'test-assets/original-gif.gif',
          testPath: `${srcPath}/imageToCopy.gif`,
          newPath: `${browserPath}/imageToCopy.gif`,
          compressed: 'test-assets/compressed-gif.gif',
        }]
      },
      {
        type: 'jpg',
        files: [{
          origin: 'test-assets/original-jpg.jpg',
          testPath: `${srcPath}/imageToCopy.jpg`,
          newPath: `${browserPath}/imageToCopy.jpg`,
          compressed: 'test-assets/compressed-jpg.jpg',
        }]
      },
      {
        type: 'png',
        files: [{
          origin: 'test-assets/original-png.png',
          testPath: `${srcPath}/imageToCopy.png`,
          newPath: `${browserPath}/imageToCopy.png`,
          compressed: 'test-assets/compressed-png.png',
        }]
      },
      {
        type: 'svg',
        files: [{
          origin: 'test-assets/original-svg.svg',
          testPath: `${srcPath}/imageToCopy.svg`,
          newPath: `${browserPath}/imageToCopy.svg`,
          compressed: 'test-assets/compressed-svg.svg',
        }]
      },
    ]

    test.each(testFileConversions)(
      'to compress $type images',
      ({ type, files }, done) => {
        const newPath = `${modulesPath}/gulp-imagemin`
        mkdirSync(modulesPath, { recursive: true })
        const copyModules = [
          'gulp-imagemin',
          'pretty-bytes',
          'imagemin',
          'plur',
          'gulp-plugin-extras',
          'easy-transform-stream',
          'graceful-fs',
          'file-type',
          'irregular-plurals',
          'globby',
          'merge2',
          'fast-glob',
          'p-pipe',
          'junk',
          'ignore',
          'slash',
          'imagemin-gifsicle',
          'imagemin-mozjpeg',
          'imagemin-optipng',
          'imagemin-svgo',
          'is-jpg',
          'mozjpeg',
          'peek-readable',
          'strtok3',
        ]
        copyRealModules(modulesPath, copyModules)
        expect.assertions(4)
        const srcFile = `${newPath}/index.js`
        makeCommon(srcFile, `${vendorPath}/gulp-imagemin`, {
          copyResources: {
            [`${modulesPath}/mozjpeg/index.js`]: [
              {
                src: `${modulesPath}/mozjpeg/package.json`,
                dest: `${vendorPath}/mozjpeg/package.json`,
                updateContent: (content) => content.replace(
                  '\n\t"type": "module",', ''
                )
              },
              {
                src: `${modulesPath}/mozjpeg/vendor`,
                dest: `${vendorPath}/mozjpeg/vendor`
              }
            ]
          },
          customChanges: {
            [`${srcFile}`]: [
              {
                updateContent: content => content.replace(
                  'export const gifsicle = await exposePlugin(\'gifsicle\');\n' +
                  'export const mozjpeg = await exposePlugin(\'mozjpeg\');\n' +
                  'export const optipng = await exposePlugin(\'optipng\');\n' +
                  'export const svgo = await exposePlugin(\'svgo\');',
                  'export const gifsicle = exposePlugin(\'gifsicle\');\n' +
                  'export const mozjpeg = exposePlugin(\'mozjpeg\');\n' +
                  'export const optipng = exposePlugin(\'optipng\');\n' +
                  'export const svgo = exposePlugin(\'svgo\');'
                )
              },
            ]
          }
        })
          .on('finish', () => {
            expect(existsSync(vendorPath)).toBeTruthy()
            // Every package.json in the converted output must have lost "type": "module", including the ones of
            // dependencies written outside the destination folder (e.g. imagemin-mozjpeg's own node_modules)
            expect(packageJsonFilesWithEsmType(vendorPath)).toEqual([])
            setTimeout(
              imageminTest,
              15000,
              files,
              done
            )
          })
          .on('error', error => {
            console.error('Encountered error', error)
            done()
          })
      },
      25000
    )
  })
})
