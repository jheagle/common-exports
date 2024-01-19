import 'core-js/stable'

/**
 * Retrieve the string part after the last search match.
 * @function
 * @param {string} str
 * @param {string} search
 * @returns {string}
 */
export const strBeforeLast = (str: string, search: string): string => {
  const index = str.lastIndexOf(search)
  return index === -1 ? '' : str.substring(0, index)
}

export default strBeforeLast
