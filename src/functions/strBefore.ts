import 'core-js/stable'

/**
 * Retrieve the string part before the search match.
 * @function
 * @param {string} str
 * @param {string} search
 * @returns {string}
 */
const strBefore = (str: string, search: string): string => {
  const index = str.indexOf(search)
  return index === -1 ? '' : str.slice(0, index)
}

export default strBefore