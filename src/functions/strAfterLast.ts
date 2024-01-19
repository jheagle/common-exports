import 'core-js/stable'

/**
 * Retrieve the string part after the last search match.
 * @function
 * @param {string} str
 * @param {string} search
 * @returns {string}
 */
export const strAfterLast = (str: string, search: string): string => {
  const index = str.lastIndexOf(search)
  return index === -1 ? '' : str.substring(index + search.length)
}

export default strAfterLast
