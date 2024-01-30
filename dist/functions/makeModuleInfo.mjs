import resolveMainFile from './resolveMainFile.mjs'
import resolveModule from './resolveModule.mjs'
/**
 * Create the Module Info object to store the name, path, and file.
 * @function
 * @param {string} dirPath
 * @param {string} moduleName
 * @returns {string}
 */
export const makeModuleInfo = (dirPath, moduleName) => resolveModule(dirPath, moduleName)
  .map((path) => ({
    module: moduleName,
    path: path,
    file: resolveMainFile(path)
  }))
export default makeModuleInfo
