import { makeFilepath } from '../utilities/makeFilepath'
import { fileExists } from 'test-filesystem'
import { readFileSync } from 'fs'
import { ModuleInfo } from './makeModuleInfo'
import { importRegex } from './importRegex'

/**
 * Attempt to detect if the current module is a common js module.
 * @memberof module:common-exports
 * @param {Object<path|file, string|null>} moduleInfo - An object containing the path and file strings.
 * @returns {boolean}
 */
export const isCommonModule = (moduleInfo: Pick<ModuleInfo, 'path' | 'file'>): boolean => {
  const packagePath = makeFilepath(moduleInfo.path, 'package.json')
  if (fileExists(packagePath)) {
    const packageData = JSON.parse(readFileSync(packagePath).toString())
    if (packageData.type && packageData.type === 'module') {
      return false
    }
  }
  if (!fileExists(moduleInfo.file)) {
    // Some native modules don't exist, hope for the best.
    return true
  }
  const mainContents = readFileSync(moduleInfo.file).toString()
  return /require\(['`"].+['`"]\)/.test(mainContents) && !importRegex().test(mainContents)
}
