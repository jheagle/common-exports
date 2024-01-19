/**
 * Retrieve all the module names from imports.
 * @function
 * @param {string} fileContents
 * @returns {Array}
 */
export const findImports = (fileContents: string): Array<string> => {
  const importRegex = new RegExp('(:?export|import)\\(?(:?\\s*[a-zA-Z{}\\s-_,/]+\\s*from\\s*)?[\'`"](.+)[\'`"]\\)?', 'g')
  return Array.from(fileContents.matchAll(importRegex))
    .reduce(
      (foundImports, matches) => {
        if (!matches[3].includes(':')) {
          foundImports.push(matches[3])
        }
        return foundImports
      },
      []
    )
}

export default findImports