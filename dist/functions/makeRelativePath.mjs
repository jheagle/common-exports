import strBefore from '../utilities/strBefore'
import strAfter from '../utilities/strAfter'
/**
 * Compare two file paths and simplify them to a relative path.
 * @param {string} fromFile
 * @param {string} toFile
 * @return {string}
 */
export const makeRelativePath = (fromFile, toFile) => {
  let relativePath = toFile
  let nextPart = fromFile
  let firstPart = strBefore(nextPart, '/')
  let hasMatches = false
  while (firstPart && relativePath.startsWith(firstPart)) {
    relativePath = strAfter(relativePath, `${firstPart}/`)
    nextPart = strAfter(nextPart, `${firstPart}/`)
    firstPart = strBefore(nextPart, '/')
    hasMatches = true
  }
  if (!hasMatches) {
    // No similar base paths, use the path as-is
    return relativePath
  }
  let relativePrefix = ''
  const nextParts = nextPart.split('/')
  if (nextParts.length < 2) {
    relativePrefix = './'
  }
  for (let i = 1; i < nextParts.length; ++i) {
    relativePrefix += '../'
  }
  return relativePrefix + relativePath
}
export default makeRelativePath
