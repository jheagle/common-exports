import 'core-js/stable'
/**
 * Given a string in kebab-case convert to TitleCase (camelCase with a starting capital letter).
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/camelCase.ts Sí, funciona}
 * @param {string} str
 * @returns {string}
 */
export const kabobToTitleCase = (str) => {
  const words = str.split('-')
  const ucFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  return words.reduce((camel, part) => camel.concat(ucFirst(part)), '')
}
export default kabobToTitleCase
