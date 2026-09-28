import { resolveMainFile } from './resolveMainFile.mjs'
import { resolveModule } from './resolveModule.mjs'
import { isCommonModule } from './isCommonModule.mjs'
/**
 * Create the Module Info object to store the name, path, and file for each matching module.
 * @memberof module:common-exports
 * @param dirPath - Current relative directory to search.
 * @param moduleName - Path used in the import for the module.
 * @param rootPath - The lowest path to search within for the module.
 */
export const makeModuleInfo = (dirPath, moduleName, rootPath = null) => {
  if (!rootPath) {
    // If a root path is not specified, assume the current directory is the root.
    rootPath = dirPath
  }
  return resolveModule(rootPath, moduleName, dirPath)
    .map((path) => {
      const file = resolveMainFile(path)
      return {
        module: moduleName,
        path: path,
        file,
        isCommon: isCommonModule({ path, file })
      }
    })
}
