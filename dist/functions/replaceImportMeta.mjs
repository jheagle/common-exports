/**
 * Find usages of import.meta and replace it with CommonJs compatible substitute.
 * @param {string} content
 * @returns {string}
 */
export const replaceImportMeta = (content) => content.replace(/import\.meta\.url/g, 'require(\'url\').pathToFileURL(__filename).toString()')
export default replaceImportMeta
