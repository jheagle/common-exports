import resolveMainFile from './resolveMainFile'
import resolveModule from './resolveModule'

export type ModuleInfo = {
  module: string,
  path: string | null,
  file: string | null,
}

/**
 * Create the Module Info object to store the name, path, and file.
 * @param {string} dirPath
 * @param {string} moduleName
 * @param {string} rootPath
 * @returns {string}
 */
export const makeModuleInfo = (dirPath: string, moduleName: string, rootPath: string | null = null): ModuleInfo[] => {
  if (!rootPath) {
    rootPath = dirPath
  }
  return resolveModule(rootPath, moduleName, dirPath)
    .map(
      (path: string): ModuleInfo => ({
        module: moduleName,
        path: path,
        file: resolveMainFile(path),
      })
    )
}

export default makeModuleInfo
