import findImports from './findImports.mjs'
import strAfter from '../utilities/strAfter'
import makeFilepath from './makeFilepath.mjs'
import isCommonModule from './isCommonModule.mjs'
import makeModuleInfo from './makeModuleInfo.mjs'
/**
 * Given a file with buffer contents, identify all the imports it has and find their full paths.
 * @function
 * @param {Object} file
 * @returns {Array<string, Object>}
 */
export function resolveImports (file) {
  const dirPath = makeFilepath(strAfter(file.base, file.cwd))
  return findImports(file.contents.toString())
    .reduce((modules, moduleName) => {
      const moduleResolutions = makeModuleInfo(dirPath, moduleName)
      if (moduleResolutions.every(isCommonModule)) {
        // CommonJs modules don't need to be updated, keep them as-is
        return modules
      }
      moduleResolutions.forEach((moduleInfo) => modules.push(moduleInfo))
      return modules
    }, [])
}
export default resolveImports
