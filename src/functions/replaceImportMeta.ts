/**
 * Find usages of import.meta and replace it with CommonJs compatible substitute.
 * @memberof module:common-exports
 * @param content - String of file contents to search for import.meta usage.
 */
export const replaceImportMeta = (content: string): string => content.replace(
  /import\.meta\.url/g,
  'require(\'url\').pathToFileURL(__filename).toString()'
)
