import { strBeforeLast } from '../utilities/strBeforeLast.mjs'
import { makeFilepath } from '../utilities/makeFilepath.mjs'
import { fileExists } from 'test-filesystem'
import { makeCommon } from '../main.mjs'
import { regexEscape } from '../utilities/regexEscape.mjs'
import { makeRelativePath } from '../utilities/makeRelativePath.mjs'
/**
 * Take a srcPath, destPath, then return a function to reduce the content for replacing file imports.
 * @memberof module:common-exports
 * @param {string} srcPath - The original path of the file to be updated.
 * @param {string} destPath - The outgoing path of the file once updated.
 * @param {Object<string, Object<string, *>>} [config={}] - Additional configuration options.
 * @returns {reduceImports}
 */
export const replaceImports = (srcPath, destPath, config = {}) => (content, importFile) => {
  if (!importFile.file) {
    console.error('Unable to find module', srcPath, importFile)
    return content
  }
  let relativePath = makeRelativePath(srcPath, importFile.file)
  let newDest = destPath
  if (newDest.endsWith('.js') || newDest.endsWith('.mjs')) {
    newDest = strBeforeLast(newDest, '/')
  }
  let modulePath = makeFilepath(newDest, relativePath)
  if (modulePath.endsWith('.mjs')) {
    modulePath = strBeforeLast(modulePath, '.mjs') + '.js'
  }
  if (!fileExists(modulePath)) {
    if (modulePath.endsWith('.js') || modulePath.endsWith('.mjs')) {
      modulePath = strBeforeLast(modulePath, '/')
    }
    makeCommon(importFile.file, modulePath, config)
  }
  const moduleName = regexEscape(importFile.module)
  const moduleMatch = new RegExp(`(['"\`])${moduleName}['"\`]`)
  if (importFile.module.includes('${')) {
    const replaceName = moduleName.replace(/(\\\$\\{.+\\})+/g, '.+')
    const replaceFor = new RegExp(`(.+\/)(${replaceName})(\/.+)`, 'g')
    relativePath = relativePath.replace(replaceFor, '$1' + importFile.module + '$3')
  }
  if (relativePath.endsWith('.mjs')) {
    // Handle wrong ending conversion from .mjs to .js file extension
    relativePath = strBeforeLast(relativePath, '.mjs') + '.js'
  }
  if (!/^\.+\//.test(relativePath)) {
    relativePath = `./${relativePath}`
  }
  return content.replace(moduleMatch, `$1${relativePath}$1`)
}
