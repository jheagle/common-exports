/**
 * Find usages of import.meta and replace it with CommonJs compatible substitute.
 * @memberof module:common-exports
 * @param {string} content - String of file contents to search for import.meta usage.
 * @returns {string}
 */
export declare const replaceImportMeta: (content: string) => string;
export default replaceImportMeta;
