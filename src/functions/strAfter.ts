import 'core-js/stable'

/**
 * Retrieve the string part after the search match.
 * @function
 * @param {string} str
 * @param {string} search
 * @returns {string}
 */
export const strAfter = (str: string, search: string): string => {
  const index = str.indexOf(search)
  return index === -1 ? '' : str.substring(index + search.length)
}

export default strAfter
