'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.makeRelativePath = exports.default = void 0
var _strBefore = _interopRequireDefault(require('../utilities/strBefore'))
var _strAfter = _interopRequireDefault(require('../utilities/strAfter'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * Compare two file paths and simplify them to a relative path.
 * @param {string} fromFile
 * @param {string} toFile
 * @return {string}
 */
const makeRelativePath = (fromFile, toFile) => {
  let relativePath = toFile
  let nextPart = fromFile
  let firstPart = (0, _strBefore.default)(nextPart, '/')
  let hasMatches = false
  while (firstPart && relativePath.startsWith(firstPart)) {
    relativePath = (0, _strAfter.default)(relativePath, `${firstPart}/`)
    nextPart = (0, _strAfter.default)(nextPart, `${firstPart}/`)
    firstPart = (0, _strBefore.default)(nextPart, '/')
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
var _default = exports.default = makeRelativePath
