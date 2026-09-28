import { findImports } from './findImports'
import { strAfter } from '../utilities/strAfter'
import { makeFilepath } from '../utilities/makeFilepath'
import { makeModuleInfo, ModuleInfo } from './makeModuleInfo'

export type Stats = {
  dev: number,
  mode: number,
  nlink: number,
  uid: number,
  gid: number,
  rdev: number,
  blksize: number,
  ino: number,
  size: number,
  blocks: number,
  atimeMs: number,
  mtimeMs: number,
  ctimeMs: number,
  birthtimeMs: number,
  atime: string
  mtime: string,
  ctime: string,
  birthtime: string
}

export type StreamFile = {
  base: string,
  contents: Buffer,
  cwd: string,
  history: string,
  isVinyl: boolean,
  path: string,
  stat: Stats,
}

/**
 * Given a file with buffer contents, identify all the imports it has and find their full paths. Common (already
 * CommonJS-compatible) modules are included too, not just modules needing conversion - see
 * {@link module:common-exports.ModuleInfo}'s isCommon flag, used by {@link module:common-exports.replaceImports} to copy them into the vendor tree as-is rather than converting
 * them. They can't simply be left alone: the vendor output directory structure doesn't mirror the original
 * node_modules layout closely enough for Node's own module resolution to find them from their new location.
 * @memberof module:common-exports
 * @param file - The in-memory fetched file object.
 * @param rootPath - The root path to use when resolving imports.
 */
export function resolveImports (file: StreamFile, rootPath: string | null = null): Array<ModuleInfo> {
  const dirPath = makeFilepath(strAfter(file.base, file.cwd))
  const useRoot = rootPath ? rootPath : dirPath
  return findImports(file.contents.toString())
    .reduce(
      (modules: ModuleInfo[], moduleName: string): ModuleInfo[] => {
        makeModuleInfo(dirPath, moduleName, useRoot).forEach(
          (moduleInfo: ModuleInfo): number => modules.push(moduleInfo)
        )
        return modules
      },
      []
    )
}
