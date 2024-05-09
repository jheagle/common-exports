import { makeFilepath } from '../utilities/makeFilepath'
import { checkPackageExports, filePath, packageExports, typeDeclarationPath } from './checkPackageExports'

export type packageContent = {
  exports?: packageExports,
  main?: filePath,
  types?: typeDeclarationPath,
}

/**
 * Given the package details, determined the configured module entry point.
 * @memberof module:common-exports
 * @param {object|string} packageData - The package contents as an object.
 * @param {string} modulePath
 * @returns {string|null}
 */
export const resolvePackageExports = (packageData: packageContent, modulePath: string): string | null => {
  if (packageData.exports) {
    // The newer "exports" config has precedence over the older "main" config
    if (typeof packageData.exports === 'string') {
      return makeFilepath(modulePath, packageData.exports)
    }
    return checkPackageExports(packageData.exports, modulePath)
  }
  if (packageData.main) {
    // The classic "main" config is still considered
    return makeFilepath(modulePath, packageData.main)
  }
  return null
}
