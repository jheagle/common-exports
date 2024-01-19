import { StreamFile } from './resolveImports'
import strBeforeLast from './strBeforeLast'
import makeFilepath from './makeFilepath'
import fileExists from './fileExists'
import makeCommon from './makeCommon'
import regexEscape from './regexEscape'
import makeRelativePath from './makeRelativePath'
import { ModuleInfo } from './makeModuleInfo'

/**
 * Build the content replacements with a reduce function.
 * @callback reduceImports
 * @param {string} content
 * @param {Object} importFile
 * @returns {string}
 */
export type reduceImports = (content: string, importFile: ModuleInfo) => string

/**
 * Take a srcPath, destPath, and file and return a function to reduce the content for replacing file imports.
 * @function
 * @param {string} srcPath
 * @param {string} destPath
 * @param {Object} file
 * @returns {reduceImports}
 */
export const replaceImports = (srcPath: string, destPath: string, file: StreamFile): reduceImports =>
  (content: string, importFile: ModuleInfo): string => {
    if (!importFile.file) {
      console.error('Unable to find module', srcPath, importFile)
      return content
    }
    let relativePath = makeRelativePath(srcPath, importFile.file)
    console.log('src', srcPath, 'file', importFile.file, 'relative', relativePath)
    let newDest = destPath
    if (newDest.endsWith('.js') || newDest.endsWith('.mjs')) {
      newDest = strBeforeLast(newDest, '/')
    }
    let modulePath = makeFilepath(newDest, relativePath)
    if (!fileExists(modulePath)) {
      if (modulePath.endsWith('.js') || modulePath.endsWith('.mjs')) {
        modulePath = strBeforeLast(modulePath, '/')
      }
      makeCommon(importFile.file, modulePath)
    }
    const moduleName = regexEscape(importFile.module)
    const moduleMatch = new RegExp(`(['"\`])${moduleName}['"\`]`)
    if (importFile.module.includes('${')) {
      const replaceName = moduleName.replace(/(\\\$\\{.+\\})+/g, '.+')
      const replaceFor = new RegExp(`(.+\/)(${replaceName})(\/.+)`, 'g')
      relativePath = relativePath.replace(replaceFor, '$1' + importFile.module + '$3')
    }
    return content.replace(moduleMatch, `$1${relativePath}$1`)
  }

export default replaceImports
