import { readFileSync } from 'fs'
import makeFilepath from './makeFilepath.mjs'
import fileExists from './fileExists.mjs'
/**
 * Given a module path, find the file which should be used as main, based on module import.
 * @param {string} modulePath
 * @returns {string|null}
 */
export const resolveMainFile = (modulePath) => {
  if (!fileExists(modulePath)) {
    // the path might be a direct file but missing the file extension, so, try some file extensions
    const jsModule = `${modulePath}.js`
    if (fileExists(jsModule)) {
      return jsModule
    }
    const mjsModule = `${modulePath}.mjs`
    if (fileExists(mjsModule)) {
      return mjsModule
    }
    return null
  }
  if (modulePath.endsWith('.js') || modulePath.endsWith('.mjs')) {
    // if it has a file extension, then the search ends here, we have found the main file
    return modulePath
  }
  const jsFile = makeFilepath(`${modulePath}.js`)
  if (fileExists(jsFile)) {
    return jsFile
  }
  const mjsFile = makeFilepath(`${modulePath}.mjs`)
  if (fileExists(mjsFile)) {
    return mjsFile
  }
  // Check if there is a package.json and search there for the specified main file
  const packagePath = makeFilepath(modulePath, 'package.json')
  if (fileExists(packagePath)) {
    const packageData = JSON.parse(readFileSync(packagePath).toString())
    if (packageData.exports) {
      if (typeof packageData.exports === 'string') {
        return makeFilepath(modulePath, packageData.exports)
      }
      return makeFilepath(modulePath, packageData.exports.default)
    }
    if (packageData.main) {
      return makeFilepath(modulePath, packageData.main)
    }
  }
  const jsPath = makeFilepath(modulePath, 'index.js')
  if (fileExists(jsPath)) {
    return jsPath
  }
  const mjsPath = makeFilepath(modulePath, 'index.mjs')
  if (fileExists(mjsPath)) {
    return mjsPath
  }
  return null
}
export default resolveMainFile
