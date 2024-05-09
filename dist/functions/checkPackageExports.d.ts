export type filePath = string;
export type relativePath = string;
export type typeDeclarationPath = filePath;
export type exportConfig = {
    browser?: filePath;
    default?: filePath;
    node?: filePath | importRequireDeclaration;
    types?: typeDeclarationPath;
};
export type importRequireDeclaration = exportConfig & {
    import?: filePath | exportConfig;
    require?: filePath | exportConfig;
};
export type conditionalExportConfig = exportConfig & {
    [key: relativePath]: filePath | importRequireDeclaration;
};
export type packageExports = filePath | conditionalExportConfig;
/**
 * Given the configured exports from a package, determine the preferred entry path.
 * @memberof module:common-exports
 * @param {object|string} exports - The relative path used to locate the module.
 * @param {string} modulePath
 * @returns {string|null}
 */
export declare const checkPackageExports: (exports: packageExports, modulePath: string) => string | null;
