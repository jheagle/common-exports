import { makeFilepath } from '../utilities/makeFilepath.mjs'
import { checkPackageExports } from './checkPackageExports.mjs'
/**
 * Given the package details, determined the configured module entry point.
 * @memberof module:common-exports
 * @param {object|string} packageData - The package contents as an object.
 * @param {string} modulePath
 * @returns {string|null}
 */
export const resolvePackageExports = (packageData, modulePath) => {
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
