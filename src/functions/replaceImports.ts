import { cpSync } from 'fs'
import { StreamFile } from './resolveImports'
import { strBeforeLast } from '../utilities/strBeforeLast'
import { makeFilepath } from '../utilities/makeFilepath'
import { fileExists } from 'test-filesystem'
import { makeCommon, makeCommonConfig } from '../main'
import { regexEscape } from '../utilities/regexEscape'
import { makeRelativePath } from '../utilities/makeRelativePath'
import { ModuleInfo } from './makeModuleInfo'

/**
 * Build the content replacements with a reduce function.
 * @callback reduceImports
 * @param {string} content - The string of file contents to find and replace imports within.
 * @param {ModuleInfo} importFile - Module location info object for the original name and path.
 * @returns {string}
 */
export type reduceImports = (content: string, importFile: ModuleInfo) => string

/**
 * Take a srcPath, destPath, then return a function to reduce the content for replacing file imports.
 * @memberof module:common-exports
 * @param {string} srcPath - The original path of the file to be updated.
 * @param {string} destPath - The outgoing path of the file once updated.
 * @param {Object<string, Object<string, *>>} [config={}] - Additional configuration options.
 * @returns {reduceImports}
 */
export const replaceImports = (srcPath: string, destPath: string, config: makeCommonConfig = {}): reduceImports =>
  (content: string, importFile: ModuleInfo): string => {
    if (!importFile.file || !importFile.path) {
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
      let moduleDir = modulePath
      if (moduleDir.endsWith('.js') || moduleDir.endsWith('.mjs')) {
        moduleDir = strBeforeLast(moduleDir, '/')
      }
      if (importFile.isCommon) {
        // Already CommonJS-compatible - copy it as-is instead of converting it. It can't be left alone entirely:
        // the vendor output doesn't mirror the original node_modules layout closely enough for Node's own
        // resolution to find it from its new location otherwise.
        //
        // Copy the whole parent node_modules directory, not just this one package's folder: common packages are
        // never scanned for their own imports, so a sibling they reach via a relative path (e.g. some-package
        // requiring '../other-package/index.js' because npm deduped them side-by-side) would otherwise never get
        // copied at all.
        cpSync(strBeforeLast(importFile.path, '/'), strBeforeLast(moduleDir, '/'), { recursive: true })
      } else {
        makeCommon(importFile.file, moduleDir, config)
      }
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
