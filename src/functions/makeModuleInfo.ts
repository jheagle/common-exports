import resolveMainFile from './resolveMainFile'
import resolveModule from './resolveModule'

export type ModuleInfo = {
  module: string,
  path: string | null,
  file: string | null,
}

/**
 * Create the Module Info object to store the name, path, and file.
 * @function
 * @param {string} dirPath
 * @param {string} moduleName
 * @returns {string}
 */
export const makeModuleInfo = (dirPath: string, moduleName: string): ModuleInfo[] => resolveModule(dirPath, moduleName)
  .map(
    (path: string): ModuleInfo => ({
      module: moduleName,
      path: path,
      file: resolveMainFile(path),
    })
  )

export default makeModuleInfo
