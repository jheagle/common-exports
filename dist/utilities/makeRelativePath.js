'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.makeRelativePath = void 0
var _strBefore = require('./strBefore')
var _strAfter = require('./strAfter')
/**
 * Compare two file paths and simplify them to a relative path.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/makeRelativePath.ts Sí, funciona}
 * @param {string} fromFile
 * @param {string} toFile
 * @return {string}
 */
const makeRelativePath = (fromFile, toFile) => {
  let relativePath = toFile
  let nextPart = fromFile
  let firstPart = (0, _strBefore.strBefore)(nextPart, '/')
  let hasMatches = false
  while (firstPart && relativePath.startsWith(firstPart)) {
    relativePath = (0, _strAfter.strAfter)(relativePath, `${firstPart}/`)
    nextPart = (0, _strAfter.strAfter)(nextPart, `${firstPart}/`)
    firstPart = (0, _strBefore.strBefore)(nextPart, '/')
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
exports.makeRelativePath = makeRelativePath
