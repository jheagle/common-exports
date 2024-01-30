import { cpSync, mkdirSync } from 'fs'
import { setUp } from 'test-filesystem'
import isCommonModule from './isCommonModule'

const tempDir = 'test-is-common-module/'
const modulesPath = `${tempDir}node_modules`

setUp.setDefaults(tempDir)

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('isCommonModule', () => {
  test('will detect a non common module', () => {
    mkdirSync(modulesPath, { recursive: true })
    const moduleName = 'globby'
    const copyModules = [moduleName]
    copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, { recursive: true }))
    const moduleInfo = {
      module: moduleName,
      path: `${modulesPath}/${moduleName}`,
      file: `${modulesPath}/${moduleName}/index.js`
    }
    expect(isCommonModule(moduleInfo)).toBeFalsy()
  })

  test('will detect a common module', () => {
    mkdirSync(modulesPath, { recursive: true })
    const moduleName = 'graceful-fs'
    const copyModules = [moduleName]
    copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, { recursive: true }))
    const moduleInfo = {
      module: moduleName,
      path: `${modulesPath}/${moduleName}`,
      file: `${modulesPath}/${moduleName}/graceful-fs.js`
    }
    expect(isCommonModule(moduleInfo)).toBeTruthy()
  })

  test('will detect import as non-common module', () => {
    mkdirSync(modulesPath, { recursive: true })
    const moduleName = 'imagemin-mozjpeg'
    const modulePath = `${moduleName}/node_modules/execa/lib`
    const copyModules = [moduleName]
    copyModules.forEach(module => cpSync(`./node_modules/${modulePath}`, `${modulesPath}/${modulePath}`, { recursive: true }))
    const moduleInfo = {
      module: moduleName,
      path: `${modulesPath}/${modulePath}`,
      file: `${modulesPath}/${modulePath}/error.js`
    }
    expect(isCommonModule(moduleInfo)).toBeFalsy()
  })
})
