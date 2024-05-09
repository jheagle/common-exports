import { makeFilepath } from '../utilities/makeFilepath'

export type filePath = string

export type relativePath = string

export type typeDeclarationPath = filePath

export type exportConfig = {
  browser?: filePath,
  default?: filePath,
  node?: filePath | importRequireDeclaration,
  types?: typeDeclarationPath
}

export type importRequireDeclaration = exportConfig & {
  import?: filePath | exportConfig,
  require?: filePath | exportConfig
}

export type conditionalExportConfig = exportConfig & {
  [key: relativePath]: filePath | importRequireDeclaration,
}

export type packageExports = filePath | conditionalExportConfig

const priorityPath = [
  'node',
  'require',
  '.',
  'default',
  'import',
  'browser',
]

/**
 * Given the configured exports from a package, determine the preferred entry path.
 * @memberof module:common-exports
 * @param {object|string} exports - The relative path used to locate the module.
 * @param {string} modulePath
 * @returns {string|null}
 */
export const checkPackageExports = (exports: packageExports, modulePath: string): string | null => {
  const result = priorityPath.find((path: string) => {
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
