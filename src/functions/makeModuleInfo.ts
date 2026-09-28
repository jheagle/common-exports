import { resolveMainFile } from './resolveMainFile'
import { resolveModule } from './resolveModule'
import { isCommonModule } from './isCommonModule'

export type ModuleInfo = {
  module: string,
  path: string | null,
  file: string | null,
  isCommon: boolean,
}

/**
 * Create the Module Info object to store the name, path, and file for each matching module.
 * @memberof module:common-exports
 * @param dirPath - Current relative directory to search.
 * @param moduleName - Path used in the import for the module.
 * @param rootPath - The lowest path to search within for the module.
 */
export const makeModuleInfo = (dirPath: string, moduleName: string, rootPath: string | null = null): ModuleInfo[] => {
  if (!rootPath) {
    // If a root path is not specified, assume the current directory is the root.
    rootPath = dirPath
  }
  return resolveModule(rootPath, moduleName, dirPath)
    .map(
      (path: string): ModuleInfo => {
        const file = resolveMainFile(path)
        return {
          module: moduleName,
          path: path,
          file,
          isCommon: isCommonModule({ path, file }),
        }
      }
    )
}
