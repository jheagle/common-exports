import { fileExists, setUp } from 'test-filesystem'
import { cpSync, mkdirSync } from 'fs'
import copyResources from './copyResources'

const tempDir = 'test-copy-resources/'
const modulesPath = `${tempDir}node_modules`
const vendorPath = `${tempDir}external-modules`

setUp.setDefaults(tempDir)

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('copyResources', () => {
  test('configured file will be copied', () => {
    mkdirSync(modulesPath, { recursive: true })
    const copyModules = [
      'mozjpeg',
    ]
    copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, { recursive: true }))
    copyResources(`${modulesPath}/mozjpeg`, {
      copyResources: {
        [`${modulesPath}/mozjpeg`]: [
          {
            src: `${modulesPath}/mozjpeg/package.json`,
            dest: `${vendorPath}/mozjpeg/package.json`
          }
        ]
      }
    })
    expect(fileExists(`${vendorPath}/mozjpeg/package.json`)).toBeTruthy()
  })
})