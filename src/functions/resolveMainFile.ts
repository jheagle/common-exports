import { readFileSync } from 'fs'
import makeFilepath from './makeFilepath'
import fileExists from './fileExists'

/**
 * Given a module path, find the file which should be used as main, based on module import.
 * @function
 * @param {string} modulePath
 * @returns {string|null}
 */
export const resolveMainFile = (modulePath: string): string | null => {
  if (!fileExists(modulePath)) {
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
