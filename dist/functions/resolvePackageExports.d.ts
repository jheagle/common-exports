import { filePath, packageExports, typeDeclarationPath } from './checkPackageExports';
export type packageContent = {
    exports?: packageExports;
    main?: filePath;
    types?: typeDeclarationPath;
};
/**
 * Given the package details, determined the configured module entry point.
 * @memberof module:common-exports
 * @param {object|string} packageData - The package contents as an object.
 * @param {string} modulePath
 * @returns {string|null}
 */
export declare const resolvePackageExports: (packageData: packageContent, modulePath: string) => string | null;
