import { StreamFile } from './resolveImports'
import strBeforeLast from '../utilities/strBeforeLast'
import makeFilepath from '../utilities/makeFilepath'
import { fileExists } from 'test-filesystem'
import makeCommon from './makeCommon'
import regexEscape from '../utilities/regexEscape'
import makeRelativePath from '../utilities/makeRelativePath'
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
 * @param {string} srcPath
 * @param {string} destPath
 * @param {Object} file
 * @param {Object<string, Object.<string, *>>} [config={}]
 * @returns {reduceImports}
 */
export const replaceImports = (srcPath: string, destPath: string, file: StreamFile, config: {
  [key: string]: { [key: string]: any }
} = {}): reduceImports =>
  (content: string, importFile: ModuleInfo): string => {
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
    return content.replace(moduleMatch, `$1${relativePath}$1`)
  }

export default replaceImports
