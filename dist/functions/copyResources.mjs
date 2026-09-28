import { cpSync, readFileSync, writeFileSync } from 'fs'
/**
 * Based on configured 'copyResources', if we are in the corresponding based path copy each src to dest.
 * @memberof module:common-exports
 * @param baseFilePath - The source / module path to process.
 * @param config -
 * The copyResources config may be present, and if it has the source path as a property,
 * then the src and dest will be used to copy resources.
 */
export const copyResources = (baseFilePath, config = {}) => {
  if (!config.hasOwnProperty('copyResources')) {
    return
  }
  if (!config.copyResources.hasOwnProperty(baseFilePath)) {
    return
  }
  config.copyResources[baseFilePath].forEach((targets) => {
    cpSync(targets.src, targets.dest, { recursive: true })
    if (targets.updateContent) {
      const originalContent = readFileSync(targets.dest).toString()
      writeFileSync(targets.dest, targets.updateContent(originalContent))
    }
  })
}
