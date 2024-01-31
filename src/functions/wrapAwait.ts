import kabobToTitleCase from '../utilities/kabobToTitleCase'

/**
 * Some import / export conversions use await which must be wrapped in an async function.
 * @param {string} fileContents
 * @param {string} fileName
 * @returns {string}
 */
export const wrapAwait = (fileContents: string, fileName: string = 'module-namespace'): string => {
  if (!/await/g.test(fileContents)) {
    // if we don't even see the word 'await', then we don't need the async function wrapped at all.
    return fileContents
  }
  const exportModuleName = `export${kabobToTitleCase(fileName)}`
  // Wrap the contents in an async function so that any await used will be valid
  return `async function ${exportModuleName} () {
  ${fileContents}
}

${exportModuleName}()`
}

export default wrapAwait
