import { strAfterLast } from '../utilities/strAfterLast.mjs'
import { makeFilepath } from '../utilities/makeFilepath.mjs'
import { fileExists } from 'test-filesystem'
import { strBeforeLast } from '../utilities/strBeforeLast.mjs'
import { makeRelativePath } from '../utilities/makeRelativePath.mjs'
import { verifyModule } from './verifyModule.mjs'
const modulesDirectory = 'node_modules'
/**
 * Search for the given module and return the full path.
 * @memberof module:common-exports
 * @param {string} root - The base path for searching.
 * @param {string} moduleName - The import name used for retrieving the module.
 * @param {string} current - The current directory we are checking for module matches.
 * @returns {Array<string>}
 */
export const resolveModule = (root, moduleName, current = '') => {
  root = makeFilepath(root)
  if (!current) {
    current = root
  }
  let hasFullPath = true
  if (moduleName.startsWith('#')) {
    moduleName = moduleName.slice(1)
    current = makeFilepath(current, 'vendor')
    hasFullPath = false
  }
  if (moduleName.startsWith('./')) {
    moduleName = moduleName.slice(2)
    hasFullPath = false
  }
  if (moduleName.startsWith('../')) {
    moduleName = moduleName.slice(3)
    hasFullPath = false
  }
  if (hasFullPath) {
    // Given longer paths, reduce them to relative parts
    moduleName = makeRelativePath(root, moduleName)
  }
  const tempCurrent = makeFilepath(current, strBeforeLast(moduleName, '/'))
  if (fileExists(tempCurrent)) {
    const result = verifyModule(moduleName, tempCurrent)
    if (result !== null) {
      return result
    }
  }
  if (current === modulesDirectory) {
    return []
  }
  let hasModules = false
  if (strAfterLast(current, '/') === modulesDirectory) {
    hasModules = true
    current = makeFilepath(current, '../../')
  }
  const next = makeFilepath(current, modulesDirectory)
  if (next === root || !next) {
    return []
  }
  if (hasModules && root !== current && current) {
    // Check relative non-modules paths, skip this bit if this is already root level
    return resolveModule(root, moduleName, current)
  }
  return resolveModule(root, moduleName, next)
}
