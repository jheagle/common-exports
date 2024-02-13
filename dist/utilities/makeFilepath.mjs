import { strBeforeLast } from './strBeforeLast.mjs'
/**
 * Format the given path so that it does not have trailing slashes and also correctly appends a path.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/makeFilePath.ts Sí, funciona}
 * @param {string} root
 * @param {string} [append='']
 * @returns {string}
 */
export const makeFilepath = (root, append = '') => {
  if (root.startsWith('./')) {
    root = root.slice(2)
  }
  if (root.startsWith('/')) {
    root = root.slice(1)
  }
  if (root.endsWith('/')) {
    root = root.slice(0, -1)
  }
  if (append.startsWith('/')) {
    append = append.slice(1)
  }
  if (append.startsWith('./')) {
    append = append.slice(2)
  }
  if (append.startsWith('../')) {
    if (!root) {
      return append.endsWith('/') ? append.slice(0, -1) : append
    }
    append = append.slice(3)
    root = strBeforeLast(root, '/')
    return makeFilepath(root, append)
  }
  if (append.endsWith('/')) {
    append = append.slice(0, -1)
  }
  if (!root) {
    return append
  }
  return append ? `${root}/${append}` : root
}
