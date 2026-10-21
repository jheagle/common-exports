/**
 * Get the regex for detecting ES6 import statements.
 */
export const importRegex = (): RegExp => /(:?export|import)\(?(:?\s*[*a-zA-Z0-9{}\s-_,/]+\s*from\s*)?['`"](.+)['`"]\)?/g
