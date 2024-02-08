import findImports from './findImports'
import strAfter from '../utilities/strAfter'
import makeFilepath from '../utilities/makeFilepath'
import isCommonModule from './isCommonModule'
import makeModuleInfo, { ModuleInfo } from './makeModuleInfo'

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
 * Given a file with buffer contents, identify all the imports it has and find their full paths.
 * @param {Object} file
 * @param {string|null} [rootPath=null]
 * @returns {Array<string, Object>}
 */
export function resolveImports (file: StreamFile, rootPath: string | null = null): Array<ModuleInfo> {
  const dirPath = makeFilepath(strAfter(file.base, file.cwd))
  const useRoot = rootPath ? rootPath : dirPath
  return findImports(file.contents.toString())
    .reduce(
      (modules: ModuleInfo[], moduleName: string): ModuleInfo[] => {
        const moduleResolutions = makeModuleInfo(dirPath, moduleName, useRoot)
        if (moduleResolutions.every(isCommonModule)) {
          // CommonJs modules don't need to be updated, keep them as-is
          return modules
        }
        moduleResolutions.forEach(
          (moduleInfo: ModuleInfo): number => modules.push(moduleInfo)
        )
        return modules
      },
      []
    )
}

export default resolveImports
