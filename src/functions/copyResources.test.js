import { countMatches, fileExists, setUp } from 'test-filesystem'
import { cpSync, mkdirSync, readFileSync } from 'fs'
import { copyResources } from './copyResources'

const tempDir = 'test-copy-resources/'
const modulesPath = `${tempDir}node_modules`
const vendorPath = `${tempDir}external-modules`

setUp.setDefaults(tempDir)

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('copyResources', () => {
  test('configured file will be copied and updateContent applied', () => {
    mkdirSync(modulesPath, { recursive: true })
    const copyModules = [
      'mozjpeg',
    ]
    copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, { recursive: true }))
    const newPackage = `${vendorPath}/mozjpeg/package.json`
    const newVendor = `${vendorPath}/mozjpeg/vendor`
    copyResources(`${modulesPath}/mozjpeg`, {
      copyResources: {
        [`${modulesPath}/mozjpeg`]: [
          {
            src: `${modulesPath}/mozjpeg/package.json`,
            dest: newPackage,
            updateContent: (content) => content.replace(
              "\n\t\"type\": \"module\",", ''
            )
          },
          {
            src: `${modulesPath}/mozjpeg/vendor`,
            dest: newVendor
          }
        ]
      }
    })
    expect(fileExists(newPackage)).toBeTruthy()
    const updatedContent = readFileSync(newPackage).toString()
    expect(countMatches(updatedContent, '"type": "module",')).toBe(0)
    expect(fileExists(`${newVendor}/cjpeg`)).toBeTruthy()
    expect(fileExists(`${newVendor}/source/mozjpeg.tar.gz`)).toBeTruthy()
  })
})