/**
 * Find usages of import.meta and replace it with CommonJs compatible substitute.
 * @param content - String of file contents to search for import.meta usage.
 */
export declare const replaceImportMeta: (content: string) => string;
