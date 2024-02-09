/**
 * Find usages of import.meta and replace it with CommonJs compatible substitute.
 * @memberof module:common-exports
 * @param {string} content - String of file contents to search for import.meta usage.
 * @returns {string}
 */
export const replaceImportMeta = (content) => content.replace(/import\.meta\.url/g, 'require(\'url\').pathToFileURL(__filename).toString()')
export default replaceImportMeta
