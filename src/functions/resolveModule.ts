import { readdirSync } from 'fs'
import strAfterLast from '../utilities/strAfterLast'
import makeFilepath from './makeFilepath'
import fileExists from './fileExists'
import regexEscape from './regexEscape'
import strBeforeLast from '../utilities/strBeforeLast'

const modulesDirectory: string = 'node_modules'

/**
 * Search for the given module and return the full path.
 * @function
 * @param {string} root
 * @param {string} moduleName
 * @param {string} current
 * @returns {Array<string>}
 */
export const resolveModule = (root: string, moduleName: string, current: string = ''): string[] => {
  if (current === root) {
    return null
  }
  root = makeFilepath(root)
  if (!current) {
    current = root
  }
  if (moduleName.startsWith('#')) {
    moduleName = moduleName.slice(1)
    current = makeFilepath(current, 'vendor')
  }
  if (moduleName.startsWith('./')) {
    moduleName = moduleName.slice(2)
  }
  if (moduleName.startsWith('../')) {
    moduleName = moduleName.slice(3)
  }
  let tempCurrent = makeFilepath(current, strBeforeLast(moduleName, '/'))
  if (fileExists(tempCurrent)) {
    let tempName = moduleName.includes('/') ? strAfterLast(moduleName, '/') : moduleName
    tempName = makeFilepath(tempName)
    tempName = regexEscape(tempName)
    if (tempName.includes('\\$\\{')) {
      // now that we already did the escape, we need to check the patter as escaped, then replace with wildcard
      tempName = tempName.replace(/(\\\$\\{.+\\})+/g, '.+')
    }
    const moduleRegex = new RegExp(`^${tempName}$`)
    const foundFiles = readdirSync(tempCurrent).filter((filePath: string): boolean => moduleRegex.test(filePath))
    if (foundFiles.length) {
      return foundFiles
        .map((found: string) => makeFilepath(tempCurrent, found))
        .filter(fileExists)
    }
  }
  if (strAfterLast(current, '/') === modulesDirectory) {
    current = makeFilepath(current, '../../')
    if (current === root || !current) {
      return []
    }
  }
  return resolveModule(root, moduleName, makeFilepath(current, modulesDirectory))
}

export default resolveModule
