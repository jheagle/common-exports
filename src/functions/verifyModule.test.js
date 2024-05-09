import { verifyModule } from './verifyModule'
import { cpSync, mkdirSync } from 'fs'
import { setUp } from 'test-filesystem'

const tempDir = 'test-verify-module/'
const modulesPath = `${tempDir}node_modules`

setUp.setDefaults(tempDir)

beforeEach(() => setUp.beforeEach()
  .then(() => {
    return mkdirSync(modulesPath, { recursive: true })
  })
)

afterEach(setUp.afterEach)

describe('verifyModule', () => {
  test('finds all matching similar packages', () => {
    const copyModules = [
      'imagemin',
      'imagemin-gifsicle',
      'imagemin-mozjpeg',
      'imagemin-optipng',
      'imagemin-svgo',
    ]
    copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, { recursive: true }))
    const moduleName = 'imagemin-${pluginName}'
    expect(verifyModule(moduleName, modulesPath)).toEqual([
      'test-verify-module/node_modules/imagemin-gifsicle',
      'test-verify-module/node_modules/imagemin-mozjpeg',
      'test-verify-module/node_modules/imagemin-optipng',
      'test-verify-module/node_modules/imagemin-svgo',
    ])
  })

  test.skip('get with specified export path', () => {
    const copyModules = [
      'file-type',
      'strtok3',
    ]
    copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, { recursive: true }))
    const fileName = `${modulesPath}/strtok3`
    const moduleName = 'strtok3/core'
    expect(verifyModule(moduleName, fileName)).toEqual(['test-verify-module/node_modules/strtok3/lib/core.js'])
  })
})
