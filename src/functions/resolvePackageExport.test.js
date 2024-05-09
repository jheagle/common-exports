import { resolvePackageExports } from './resolvePackageExports'
import { mkdirSync } from 'fs'
import { setUp } from 'test-filesystem'

const tempDir = 'test-resolve-package-export/'
const modulesPath = `${tempDir}node_modules`

setUp.setDefaults(tempDir)

beforeEach(() => setUp.beforeEach()
  .then(() => {
    return mkdirSync(modulesPath, { recursive: true })
  })
)

afterEach(setUp.afterEach)

describe('resolvePackageExports', () => {
  test('resolves path to file configured as main', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    const foundModulePath = resolvePackageExports(
      { main: './dist/main.js' },
      modulePath
    )
    expect(foundModulePath).toEqual(`${modulePath}/dist/main.js`)
  })

  test('resolves path to file configured as exports', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    const exportFile = `${moduleName}/dist/main.mjs`
    const newExported = `${modulesPath}/${exportFile}`
    const foundModulePath = resolvePackageExports(
      { exports: `./dist/main.mjs` },
      modulePath
    )
    expect(foundModulePath).toEqual(newExported)
  })

  test('resolves path to default index.js', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    const newMain = `${modulesPath}/${moduleName}/index.js`
    const foundModulePath = resolvePackageExports(
      { exports: { default: `./index.js` } },
      modulePath
    )
    expect(foundModulePath).toEqual(newMain)
  })

  test('resolves path to default index.mjs', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    const newMain = `${modulesPath}/${moduleName}/index.mjs`
    const foundModulePath = resolvePackageExports(
      { exports: { default: `./index.mjs` } },
      modulePath
    )
    expect(foundModulePath).toEqual(newMain)
  })

  test('resolves path to root require', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    const newMain = `${modulesPath}/${moduleName}/cjs/index.cjs`
    const foundModulePath = resolvePackageExports(
      {
        exports: {
          '.': {
            'import': './mjs/index.mjs',
            'require': './cjs/index.cjs',
          }
        }
      },
      modulePath
    )
    expect(foundModulePath).toEqual(newMain)
  })
})
