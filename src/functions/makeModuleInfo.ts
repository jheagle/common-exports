import resolveMainFile from './resolveMainFile'
import resolveModule from './resolveModule'

/**
 * Module info stores the location data for a module found through imports.
 * @typedef {Object<module|path|file, string|null>} ModuleInfo
 * @property {string} module - Name or path used in the import to get the module.
 * @property {string|null} path - The full (relative to root) path for retrieving the module.
 * @property {string|null} file - The main / index file of the module.
 */
export type ModuleInfo = {
  module: string,
  path: string | null,
  file: string | null,
}

/**
 * Create the Module Info object to store the name, path, and file for each matching module.
 * @memberof module:common-exports
 * @param {string} dirPath - Current relative directory to search.
 * @param {string} moduleName - Path used in the import for the module.
 * @param {string} rootPath - The lowest path to search within for the module.
 * @returns {Array<ModuleInfo>}
 */
export const makeModuleInfo = (dirPath: string, moduleName: string, rootPath: string | null = null): ModuleInfo[] => {
  if (!rootPath) {
    // If a root path is not specified, assume the current directory is the root.
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
