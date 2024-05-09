import { resolveMainFile } from './resolveMainFile'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { setUp } from 'test-filesystem'

const tempDir = 'test-resolve-main-file/'
const modulesPath = `${tempDir}node_modules`

setUp.setDefaults(tempDir)

beforeEach(() => setUp.beforeEach()
  .then(() => {
    return mkdirSync(modulesPath, { recursive: true })
  })
)

afterEach(setUp.afterEach)

describe('resolveMainFile', () => {
  test('cannot resolve invalid package path', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    const foundModulePath = resolveMainFile(modulePath)
    expect(foundModulePath).toBeNull()
  })

  test('resolves path to file configured as main', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    mkdirSync(modulePath, { recursive: true })
    mkdirSync(`${modulePath}/dist`, { recursive: true })
    const mainFile = `${moduleName}/dist/main.js`
    const mainContent = readFileSync(`./node_modules/${mainFile}`).toString()
    const newMain = `${modulesPath}/${mainFile}`
    writeFileSync(newMain, mainContent)
    const modulePackage = `${moduleName}/package.json`
    const packageContent = readFileSync(`./node_modules/${modulePackage}`).toString()
    const newPackage = `${modulesPath}/${modulePackage}`
    writeFileSync(newPackage, packageContent)
    const foundModulePath = resolveMainFile(modulePath)
    expect(foundModulePath).toEqual(`${modulePath}/dist/main.js`)
  })

  test('resolves path to file configured as exports', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    mkdirSync(modulePath, { recursive: true })
    mkdirSync(`${modulePath}/dist`, { recursive: true })
    const mainFile = `${moduleName}/dist/main.js`
    const mainContent = readFileSync(`./node_modules/${mainFile}`).toString()
    const newMain = `${modulesPath}/${mainFile}`
    writeFileSync(newMain, mainContent)
    const exportFile = `${moduleName}/dist/main.mjs`
    const exportContent = readFileSync(`./node_modules/${exportFile}`).toString()
    const newExported = `${modulesPath}/${exportFile}`
    writeFileSync(newExported, exportContent)
    const modulePackage = `${moduleName}/package.json`
    const packageContent = readFileSync(`./node_modules/${modulePackage}`).toString()
    const packageJson = JSON.parse(packageContent)
    packageJson.exports = './dist/main.mjs'
    const newPackage = `${modulesPath}/${modulePackage}`
    writeFileSync(newPackage, JSON.stringify(packageJson))
    const foundModulePath = resolveMainFile(modulePath)
    expect(foundModulePath).toEqual(newExported)
  })

  test('resolves path to default index.js', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    mkdirSync(modulePath, { recursive: true })
    const mainFile = `${moduleName}/dist/main.js`
    const mainContent = readFileSync(`./node_modules/${mainFile}`).toString()
    const newMain = `${modulesPath}/${moduleName}/index.js`
    writeFileSync(newMain, mainContent)
    const foundModulePath = resolveMainFile(modulePath)
    expect(foundModulePath).toEqual(newMain)
  })

  test('resolves path to default index.mjs', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    mkdirSync(modulePath, { recursive: true })
    const mainFile = `${moduleName}/dist/main.mjs`
    const mainContent = readFileSync(`./node_modules/${mainFile}`).toString()
    const newMain = `${modulesPath}/${moduleName}/index.mjs`
    writeFileSync(newMain, mainContent)
    const foundModulePath = resolveMainFile(modulePath)
    expect(foundModulePath).toEqual(newMain)
  })

  test('resolves module direct path to js', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${tempDir}/${moduleName}`
    const mainFile = `${moduleName}/dist/main.js`
    const mainContent = readFileSync(`./node_modules/${mainFile}`).toString()
    const newMain = `${modulePath}.js`
    writeFileSync(newMain, mainContent)
    const foundModulePath = resolveMainFile(modulePath)
    expect(foundModulePath).toEqual(newMain)
  })

  test('resolves module direct path to mjs', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${tempDir}/${moduleName}`
    const mainFile = `${moduleName}/dist/main.mjs`
    const mainContent = readFileSync(`./node_modules/${mainFile}`).toString()
    const newMain = `${modulePath}.mjs`
    writeFileSync(newMain, mainContent)
    const foundModulePath = resolveMainFile(modulePath)
    expect(foundModulePath).toEqual(newMain)
  })
})
