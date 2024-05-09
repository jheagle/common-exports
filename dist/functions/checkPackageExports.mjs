import { makeFilepath } from '../utilities/makeFilepath.mjs'
const priorityPath = [
  'node',
  'require',
  '.',
  'default',
  'import',
  'browser'
]
/**
 * Given the configured exports from a package, determine the preferred entry path.
 * @memberof module:common-exports
 * @param {object|string} exports - The relative path used to locate the module.
 * @param {string} modulePath
 * @returns {string|null}
 */
export const checkPackageExports = (exports, modulePath) => {
  const result = priorityPath.find((path) => {
    return typeof exports[path] !== 'undefined'
  })
  if (typeof result === 'undefined') {
    return null
  }
  if (typeof exports[result] === 'string') {
    return makeFilepath(modulePath, exports[result])
  }
  return checkPackageExports(exports[result], modulePath)
}
