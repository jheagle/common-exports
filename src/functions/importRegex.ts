/**
 * Get the regex for detecting ES6 import statements.
 * @function
 * @returns {string}
 */
export const importRegex = (): RegExp => new RegExp('(:?export|import)\\(?(:?\\s*[a-zA-Z{}\\s-_,/]+\\s*from\\s*)?[\'`"](.+)[\'`"]\\)?', 'g')

export default importRegex
