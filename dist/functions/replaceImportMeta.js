'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.replaceImportMeta = exports.default = void 0
/**
 * Find usages of import.meta and replace it with CommonJs compatible substitute.
 * @param {string} content
 * @returns {string}
 */
const replaceImportMeta = content => content.replace(/import\.meta\.url/g, 'require(\'url\').pathToFileURL(__filename).toString()')
exports.replaceImportMeta = replaceImportMeta
var _default = exports.default = replaceImportMeta
