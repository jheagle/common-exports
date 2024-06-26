import { readFileSync } from 'fs'
import { makeFilepath } from '../utilities/makeFilepath.mjs'
import { fileExists } from 'test-filesystem'
import { resolvePackageExports } from './resolvePackageExports.mjs'
/**
 * Given a module path, find the file which should be used as main, based on module import.
 * @memberof module:common-exports
 * @param {string} modulePath - The relative path used to locate the module.
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
    const resolvedFile = resolvePackageExports(JSON.parse(readFileSync(packagePath).toString()), modulePath)
    if (resolvedFile !== null) {
      return resolvedFile
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
