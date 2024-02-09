import importRegex from './importRegex'

/**
 * Retrieve all the module names from imports.
 * @memberof module:common-exports
 * @param {string} fileContents - The string of contents to parse for import matches.
 * @returns {Array}
 */
export const findImports = (fileContents: string): Array<string> => Array.from(fileContents.matchAll(importRegex()))
  .reduce(
    (foundImports, matches) => {
      if (!matches[3].includes(':')) {
        // exclude modules for node:, file:, etc.
        foundImports.push(matches[3])
      }
      return foundImports
    },
    []
  )

export default findImports
