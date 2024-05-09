import { checkPackageExports } from './checkPackageExports'
import { mkdirSync } from 'fs'
import { setUp } from 'test-filesystem'

const tempDir = 'test-check-package-exports/'
const modulesPath = `${tempDir}node_modules`

setUp.setDefaults(tempDir)

beforeEach(() => setUp.beforeEach()
  .then(() => {
    return mkdirSync(modulesPath, { recursive: true })
  })
)

afterEach(setUp.afterEach)

describe('checkPackageExports', () => {
  const moduleName = 'test-filesystem'
  const modulePath = `${modulesPath}/${moduleName}`
  const testExportConfig = [
    {
      description: 'Use default at top-level',
      exportConfig: {
        default: `./index.js`
      },
      expected: `${modulesPath}/${moduleName}/index.js`
    },
    {
      description: 'Use require in base path config',
      exportConfig: {
        '.': {
          'import': './mjs/index.mjs',
          'require': './cjs/index.cjs',
        }
      },
      expected: `${modulesPath}/${moduleName}/cjs/index.cjs`
    }
  ]
  test.each(testExportConfig)(
    `$description`,
    ({ description, exportConfig, expected }) => {
      expect(
        checkPackageExports(
          exportConfig,
          modulePath
        )
      ).toEqual(expected)
    }
  )
})
