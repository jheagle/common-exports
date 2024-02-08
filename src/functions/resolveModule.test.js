import resolveModule from './resolveModule'
import { cpSync, mkdirSync } from 'fs'
import { setUp } from 'test-filesystem'

const tempDir = 'test-resolve-module/'
const modulesPath = `${tempDir}node_modules`
const srcPath = `${tempDir}src`

setUp.setDefaults(tempDir)

beforeEach(() => setUp.beforeEach()
  .then(() => {
    return mkdirSync(modulesPath, { recursive: true })
  })
)

afterEach(setUp.afterEach)

describe('resolveModule', () => {
  test('resolves path to module', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    mkdirSync(modulePath, { recursive: true })
    const foundModulePath = resolveModule(tempDir, moduleName)
    expect(foundModulePath).toEqual([modulePath])
  })

  test('resolves as empty array for module not found', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    mkdirSync(modulePath, { recursive: true })
    const foundModulePath = resolveModule(tempDir, moduleName + '-fake')
    expect(foundModulePath).toEqual([])
  })

  test('resolves adjacent module', () => {
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    mkdirSync(modulePath, { recursive: true })
    const otherModuleName = 'other-module'
    const otherModulePath = `${modulesPath}/${otherModuleName}`
    mkdirSync(otherModulePath, { recursive: true })
    const foundModulePath = resolveModule(otherModulePath, moduleName)
    expect(foundModulePath).toEqual(['test-resolve-module/node_modules/test-filesystem'])
  })

  test('resolves similar named modules', () => {
    const copyModules = [
      'imagemin',
      'imagemin-gifsicle',
      'imagemin-mozjpeg',
      'imagemin-optipng',
      'imagemin-svgo',
    ]
    copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, { recursive: true }))
    const foundModulePath = resolveModule(tempDir, 'imagemin')
    expect(foundModulePath).toEqual([
      'test-resolve-module/node_modules/imagemin',
    ])
  })

  test('resolves incomplete module name', () => {
    const copyModules = [
      'imagemin',
      'imagemin-gifsicle',
      'imagemin-mozjpeg',
      'imagemin-optipng',
      'imagemin-svgo',
    ]
    copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, { recursive: true }))
    const foundModulePath = resolveModule(tempDir, 'imagemin-${pluginName}')
    expect(foundModulePath).toEqual([
      'test-resolve-module/node_modules/imagemin-gifsicle',
      'test-resolve-module/node_modules/imagemin-mozjpeg',
      'test-resolve-module/node_modules/imagemin-optipng',
      'test-resolve-module/node_modules/imagemin-svgo',
    ])
  })

  test('resolves relative file', () => {
    const copyModules = [
      'gulp-imagemin',
    ]
    copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, { recursive: true }))
    const foundModulePath = resolveModule(`${modulesPath}/gulp-imagemin/node_modules/chalk/source`, './utilities.js')
    expect(foundModulePath).toEqual([
      `${modulesPath}/gulp-imagemin/node_modules/chalk/source/utilities.js`,
    ])
  })

  test('resolves relative vendor path', () => {
    const copyModules = [
      'gulp-imagemin',
    ]
    copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, { recursive: true }))
    const foundModulePath = resolveModule(`${modulesPath}/gulp-imagemin/node_modules/chalk/source`, '#ansi-styles')
    expect(foundModulePath).toEqual([
      `${modulesPath}/gulp-imagemin/node_modules/chalk/source/vendor/ansi-styles`,
    ])
  })

  test('resolves deep nested paths', () => {
    const copyModules = [
      'imagemin-mozjpeg',
    ]
    copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, { recursive: true }))
    let foundModulePath = ''
    foundModulePath = resolveModule(`${modulesPath}/imagemin-mozjpeg/node_modules/execa`, 'strip-final-newline')
    expect(foundModulePath).toEqual([`${modulesPath}/imagemin-mozjpeg/node_modules/strip-final-newline`])
    foundModulePath = resolveModule(`${modulesPath}/imagemin-mozjpeg/node_modules/execa`, 'npm-run-path')
    expect(foundModulePath).toEqual([`${modulesPath}/imagemin-mozjpeg/node_modules/npm-run-path`])
    foundModulePath = resolveModule(`${modulesPath}/imagemin-mozjpeg/node_modules/execa`, 'onetime')
    expect(foundModulePath).toEqual([`${modulesPath}/imagemin-mozjpeg/node_modules/onetime`])
    foundModulePath = resolveModule(`${modulesPath}/imagemin-mozjpeg/node_modules/execa`, './lib/error.js')
    expect(foundModulePath).toEqual([`${modulesPath}/imagemin-mozjpeg/node_modules/execa/lib/error.js`])
    foundModulePath = resolveModule(`${modulesPath}/imagemin-mozjpeg/node_modules/execa`, './lib/stdio.js')
    expect(foundModulePath).toEqual([`${modulesPath}/imagemin-mozjpeg/node_modules/execa/lib/stdio.js`])
    foundModulePath = resolveModule(`${modulesPath}/imagemin-mozjpeg/node_modules/execa`, './lib/kill.js')
    expect(foundModulePath).toEqual([`${modulesPath}/imagemin-mozjpeg/node_modules/execa/lib/kill.js`])
    foundModulePath = resolveModule(`${modulesPath}/imagemin-mozjpeg/node_modules/execa`, './lib/stream.js')
    expect(foundModulePath).toEqual([`${modulesPath}/imagemin-mozjpeg/node_modules/execa/lib/stream.js`])
    foundModulePath = resolveModule(`${modulesPath}/imagemin-mozjpeg/node_modules/execa`, './lib/promise.js')
    expect(foundModulePath).toEqual([`${modulesPath}/imagemin-mozjpeg/node_modules/execa/lib/promise.js`])
    foundModulePath = resolveModule(`${modulesPath}/imagemin-mozjpeg/node_modules/execa`, './lib/command.js')
    expect(foundModulePath).toEqual([`${modulesPath}/imagemin-mozjpeg/node_modules/execa/lib/command.js`])
  })

  test('resolves down to root path', () => {
    mkdirSync(srcPath, { recursive: true })
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    mkdirSync(modulePath, { recursive: true })
    const foundModulePath = resolveModule(tempDir, moduleName, srcPath)
    expect(foundModulePath).toEqual([`${modulesPath}/${moduleName}`])
  })

  test('resolves down to root deeper root path', () => {
    mkdirSync(srcPath, { recursive: true })
    const moduleName = 'test-filesystem'
    const modulePath = `${modulesPath}/${moduleName}`
    mkdirSync(modulePath, { recursive: true })
    const rootPath = './'
    const dirPath = 'src'
    const foundModulePath = resolveModule(rootPath, moduleName, dirPath)
    expect(foundModulePath).toEqual([`node_modules/${moduleName}`])
  })
})
