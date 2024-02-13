import { countMatches, fileExists, setUp } from 'test-filesystem'
import { cpSync, mkdirSync, readFileSync } from 'fs'
import { customChanges } from './customChanges'

const tempDir = 'test-copy-resources/'
const modulesPath = `${tempDir}node_modules`

setUp.setDefaults(tempDir)

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('customChanges', () => {
  test('configured function will be applied to the content', () => {
    mkdirSync(modulesPath, { recursive: true })
    const copyModules = [
      'imagemin-mozjpeg',
    ]
    copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, { recursive: true }))
    const updateFile = `${modulesPath}/imagemin-mozjpeg/node_modules/execa/lib/kill.js`
    const updateContent = readFileSync(updateFile).toString()
    const changeContent = 'import { onExit } from \'signal-exit\';'
    const changedContent = customChanges(updateFile, updateContent, {
      customChanges: {
        [updateFile]: [
          {
            updateContent: (content) => content.replace(
              'import onExit from \'signal-exit\';',
              changeContent
            )
          }
        ]
      }
    })
    expect(countMatches(changedContent, changeContent)).toBe(1)
  })
})