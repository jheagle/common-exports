import findImports from './findImports.mjs'
import strAfter from '../utilities/strAfter'
import makeFilepath from '../utilities/makeFilepath'
import isCommonModule from './isCommonModule.mjs'
import makeModuleInfo from './makeModuleInfo.mjs'
/**
 * Given a file with buffer contents, identify all the imports it has and find their full paths.
 * @memberof module:common-exports
 * @param {StreamFile} file - The in-memory fetched file object.
 * @param {string|null} [rootPath=null] - The root path to use when resolving imports.
 * @returns {Array<ModuleInfo>}
 */
export function resolveImports (file, rootPath = null) {
  const dirPath = makeFilepath(strAfter(file.base, file.cwd))
  const useRoot = rootPath || dirPath
  return findImports(file.contents.toString())
    .reduce((modules, moduleName) => {
      const moduleResolutions = makeModuleInfo(dirPath, moduleName, useRoot)
      if (moduleResolutions.every(isCommonModule)) {
        // CommonJs modules don't need to be updated, keep them as-is
        return modules
      }
      moduleResolutions.forEach((moduleInfo) => modules.push(moduleInfo))
      return modules
    }, [])
}
export default resolveImports
