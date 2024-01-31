import makeFilepath from './makeFilepath'
import fileExists from './fileExists'
import { readFileSync } from 'fs'
import { ModuleInfo } from './makeModuleInfo'
import importRegex from './importRegex'

/**
 * Attempt to detect if the current module is a common js module.
 * @param {Object} moduleInfo
 * @returns {boolean}
 */
export const isCommonModule = (moduleInfo: ModuleInfo): boolean => {
  const packagePath = makeFilepath(moduleInfo.path, 'package.json')
  if (fileExists(packagePath)) {
    const packageData = JSON.parse(readFileSync(packagePath).toString())
    if (packageData.type && packageData.type === 'module') {
      return false
    }
  }

  const mainContents = readFileSync(moduleInfo.file).toString()
  return /require\(['`"].+['`"]\)/.test(mainContents) && !importRegex().test(mainContents)
}

export default isCommonModule
