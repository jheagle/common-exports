import { findImports } from './findImports.mjs'
import { strAfter } from '../utilities/strAfter.mjs'
import { makeFilepath } from '../utilities/makeFilepath.mjs'
import { makeModuleInfo } from './makeModuleInfo.mjs'
/**
 * Given a file with buffer contents, identify all the imports it has and find their full paths. Common (already
 * CommonJS-compatible) modules are included too, not just modules needing conversion - see
 * {@link module:common-exports.ModuleInfo}'s isCommon flag, used by {@link module:common-exports.replaceImports} to copy them into the vendor tree as-is rather than converting
 * them. They can't simply be left alone: the vendor output directory structure doesn't mirror the original
 * node_modules layout closely enough for Node's own module resolution to find them from their new location.
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
      makeModuleInfo(dirPath, moduleName, useRoot).forEach((moduleInfo) => modules.push(moduleInfo))
      return modules
    }, [])
}
