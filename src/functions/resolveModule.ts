import { readdirSync } from 'fs'
import strAfterLast from '../utilities/strAfterLast'
import makeFilepath from '../utilities/makeFilepath'
import { fileExists } from 'test-filesystem'
import regexEscape from '../utilities/regexEscape'
import strBeforeLast from '../utilities/strBeforeLast'
import makeRelativePath from '../utilities/makeRelativePath'

const modulesDirectory: string = 'node_modules'

/**
 * Search for the given module and return the full path.
 * @param {string} root
 * @param {string} moduleName
 * @param {string} current
 * @returns {Array<string>}
 */
export const resolveModule = (root: string, moduleName: string, current: string = ''): string[] => {
  root = makeFilepath(root)
  if (!current) {
    current = root
  }
  let hasFullPath = true
  if (moduleName.startsWith('#')) {
    moduleName = moduleName.slice(1)
    current = makeFilepath(current, 'vendor')
    hasFullPath = false
  }
  if (moduleName.startsWith('./')) {
    moduleName = moduleName.slice(2)
    hasFullPath = false
  }
  if (moduleName.startsWith('../')) {
    moduleName = moduleName.slice(3)
    hasFullPath = false
  }
  if (hasFullPath) {
    // Given longer paths, reduce them to relative parts
    moduleName = makeRelativePath(root, moduleName)
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
  if (current === modulesDirectory) {
    return []
  }
  if (strAfterLast(current, '/') === modulesDirectory) {
    current = makeFilepath(current, '../../')
  }
  const next = makeFilepath(current, modulesDirectory)
  if (next === root || !next) {
    return []
  }
  return resolveModule(root, moduleName, next)
}

export default resolveModule
