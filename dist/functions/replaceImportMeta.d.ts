/**
 * Find usages of import.meta and replace it with CommonJs compatible substitute.
 * @function
 * @param {string} content
 * @returns {string}
 */
export declare const replaceImportMeta: (content: string) => string;
export default replaceImportMeta;
