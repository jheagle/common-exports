/**
 * Find usages of import.meta and replace it with CommonJs compatible substitute.
 * @memberof module:common-exports
 * @param content - String of file contents to search for import.meta usage.
 */
export declare const replaceImportMeta: (content: string) => string;
