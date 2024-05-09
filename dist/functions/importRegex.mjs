/**
 * Get the regex for detecting ES6 import statements.
 * @memberof module:common-exports
 * @returns {string}
 */
export const importRegex = () => new RegExp('(:?export|import)\\(?(:?\\s*[*a-zA-Z0-9{}\\s-_,/]+\\s*from\\s*)?[\'`"](.+)[\'`"]\\)?', 'g')
