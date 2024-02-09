'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.wrapAwait = exports.default = void 0
var _kabobToTitleCase = _interopRequireDefault(require('../utilities/kabobToTitleCase'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * Some import / export conversions use await which must be wrapped in an async function.
 * @memberof module:common-exports
 * @param {string} fileContents - The string content of the file for updating.
 * @param {string} fileName - The name of the file we are doing changes for.
 * @returns {string}
 */
const wrapAwait = (fileContents, fileName = 'module-namespace') => {
  if (!/await/g.test(fileContents)) {
    // if we don't even see the word 'await', then we don't need the async function wrapped at all.
    return fileContents
  }
  const exportModuleName = `export${(0, _kabobToTitleCase.default)(fileName)}`
  // Wrap the contents in an async function so that any await used will be valid
  return `async function ${exportModuleName} () {
  ${fileContents}
}

${exportModuleName}()`
}
exports.wrapAwait = wrapAwait
var _default = exports.default = wrapAwait
