import strBefore from './strBefore'
import strAfter from './strAfter'

/**
 * Compare two file paths and simplify them to a relative path.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/makeRelativePath.ts Sí, funciona}
 * @param {string} fromFile
 * @param {string} toFile
 * @return {string}
 */
export const makeRelativePath = (fromFile: string, toFile: string): string => {
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
