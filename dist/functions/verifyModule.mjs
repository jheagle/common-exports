import { strAfterLast } from '../utilities/strAfterLast.mjs'
import { makeFilepath } from '../utilities/makeFilepath.mjs'
import { regexEscape } from '../utilities/regexEscape.mjs'
import { readdirSync, readFileSync, statSync } from 'fs'
import { fileExists } from 'test-filesystem'
/**
 * Check if the current path contains the module we are looking for.
 * @memberof module:common-exports
 * @param {string} moduleName
 * @param {string} current
 * @returns {Array<string>|null}
 */
export const verifyModule = (moduleName, current) => {
  let tempName = moduleName.includes('/') ? strAfterLast(moduleName, '/') : moduleName
  tempName = makeFilepath(tempName)
  tempName = regexEscape(tempName)
  if (tempName.includes('\\$\\{')) {
    // now that we already did the escape, we need to check the pattern as escaped, then replace with wildcard
    tempName = tempName.replace(/(\\\$\\{.+\\})+/g, '.+')
  }
  const moduleRegex = new RegExp(`^${tempName}$`)
  const pathStats = statSync(current)
  if (pathStats.isDirectory()) {
    const dirFiles = readdirSync(current)
    const foundFiles = dirFiles.filter((filePath) => moduleRegex.test(filePath))
    if (foundFiles.length) {
      return foundFiles
        .map((found) => makeFilepath(current, found))
        .filter(fileExists)
    }
    if (dirFiles.includes('package.json')) {
      // package.json was in the files we found, use it to get more information on this module
      const packagePath = `${current}/package.json`
      const packageContent = JSON.parse(readFileSync(packagePath).toString())
      const relativeName = `./${tempName}`
      if (typeof packageContent.exports !== 'undefined' && typeof packageContent.exports[relativeName] !== 'undefined') {
        return [makeFilepath(current, packageContent.exports[relativeName])]
      }
    }
  }
  return null
}
