import resolveMainFile from './resolveMainFile.mjs'
import resolveModule from './resolveModule.mjs'
/**
 * Create the Module Info object to store the name, path, and file.
 * @param {string} dirPath
 * @param {string} moduleName
 * @param {string} rootPath
 * @returns {string}
 */
export const makeModuleInfo = (dirPath, moduleName, rootPath = null) => {
  if (!rootPath) {
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
