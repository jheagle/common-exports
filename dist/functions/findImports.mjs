import importRegex from './importRegex.mjs'
/**
 * Retrieve all the module names from imports.
 * @function
 * @param {string} fileContents
 * @returns {Array}
 */
export const findImports = (fileContents) => Array.from(fileContents.matchAll(importRegex()))
  .reduce((foundImports, matches) => {
    if (!matches[3].includes(':')) {
      // exclude modules for node:, file:, etc.
      foundImports.push(matches[3])
    }
    return foundImports
  }, [])
export default findImports
