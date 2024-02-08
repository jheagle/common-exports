import makeFilepath from '../utilities/makeFilepath'
import { fileExists } from 'test-filesystem'
import { readFileSync } from 'fs'
import importRegex from './importRegex.mjs'
/**
 * Attempt to detect if the current module is a common js module.
 * @param {Object} moduleInfo
 * @returns {boolean}
 */
export const isCommonModule = (moduleInfo) => {
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
