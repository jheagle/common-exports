import { cpSync, readFileSync, writeFileSync } from 'fs'
import { makeCommonConfig, updateContentCallback } from '../main'

/**
 * Based on configured 'copyResources', if we are in the corresponding based path copy each src to dest.
 * @memberof module:common-exports
 * @param {string} baseFilePath - The source / module path to process.
 * @param {Object<'copyResources', Object<string, Array<Object<'src'|'dest'|'updateContent', string|Function>>>>} [config={}] -
 * The copyResources config may be present, and if it has the source path as a property,
 * then the src and dest will be used to copy resources.
 * @returns {undefined}
 */
export const copyResources = (baseFilePath: string, config: makeCommonConfig = {}): void => {
  if (!config.hasOwnProperty('copyResources')) {
    return
  }
  if (!config.copyResources.hasOwnProperty(baseFilePath)) {
    return
  }
  config.copyResources[baseFilePath].forEach(
    (targets: { src: string, dest: string, updateContent?: updateContentCallback | null }): void => {
      cpSync(targets.src, targets.dest, { recursive: true })
      if (targets.updateContent) {
        const originalContent = readFileSync(targets.dest).toString()
        writeFileSync(targets.dest, targets.updateContent(originalContent))
      }
    }
  )
}
