import { resolveMainFile } from './resolveMainFile'
import { resolveModule } from './resolveModule'
import { isCommonModule } from './isCommonModule'
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
        // Neither the fake path nor file exist on disk, so isCommonModule's "hope for the best" fallback applies.
        isCommon: true,
      }
    ])
  })

  test('forwards isCommonModule\'s result as the isCommon flag', () => {
    jest.spyOn(require('./isCommonModule'), 'isCommonModule').mockReturnValue(false)
    const moduleInfo = makeModuleInfo(basePath, moduleName)
    expect(isCommonModule).toHaveBeenCalledWith({ path: mockPath, file: mockFile })
    expect(moduleInfo).toEqual([
      {
        module: moduleName,
        path: mockPath,
        file: mockFile,
        isCommon: false,
      }
    ])
    jest.restoreAllMocks()
  })
})
