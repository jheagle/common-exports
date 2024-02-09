import resolveMainFile from './resolveMainFile.mjs'
import resolveModule from './resolveModule.mjs'
/**
 * Create the Module Info object to store the name, path, and file for each matching module.
 * @memberof module:common-exports
 * @param {string} dirPath - Current relative directory to search.
 * @param {string} moduleName - Path used in the import for the module.
 * @param {string} rootPath - The lowest path to search within for the module.
 * @returns {Array<ModuleInfo>}
 */
export const makeModuleInfo = (dirPath, moduleName, rootPath = null) => {
  if (!rootPath) {
    // If a root path is not specified, assume the current directory is the root.
    rootPath = dirPath
  }
  return resolveModule(rootPath, moduleName, dirPath)
    .map((path) => ({
      module: moduleName,
      path: path,
      file: resolveMainFile(path)
    }))
}
export default makeModuleInfo
