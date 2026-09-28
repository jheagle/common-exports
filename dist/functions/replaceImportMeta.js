'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.replaceImportMeta = void 0
/**
 * Find usages of import.meta and replace it with CommonJs compatible substitute.
 * @memberof module:common-exports
 * @param content - String of file contents to search for import.meta usage.
 */
const replaceImportMeta = content => content.replace(/import\.meta\.url/g, 'require(\'url\').pathToFileURL(__filename).toString()')
exports.replaceImportMeta = replaceImportMeta
