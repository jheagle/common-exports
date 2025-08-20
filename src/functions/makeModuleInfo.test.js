import { resolveMainFile } from './resolveMainFile'
import { resolveModule } from './resolveModule'
import { makeModuleInfo } from './makeModuleInfo'

const moduleName = 'test-filesystem'
const basePath = 'test-make-module-info'
const mockPath = `${basePath}/node_modules/${moduleName}`
const mockFile = `${mockPath}/index.js`
jest.mock('./resolveModule', () => ({ resolveModule: jest.fn(() => [mockPath]) }))
jest.mock('./resolveMainFile', () => ({ resolveMainFile: jest.fn(() => mockFile) }))

describe('makeModuleInfo', () => {
  test('make a call to build the module info', () => {
    const moduleInfo = makeModuleInfo(basePath, moduleName)
    expect(resolveModule).toHaveBeenCalledWith(basePath, moduleName, basePath)
    expect(resolveMainFile).toHaveBeenCalledWith(mockPath)
    expect(moduleInfo).toEqual([
      {
        module: moduleName,
        path: mockPath,
        file: mockFile,
      }
    ])
  })
})
