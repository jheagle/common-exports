import { cpSync } from 'fs'

/**
 * Based on configured 'copyResources', if we are in the corresponding based path copy each src to dest.
 * @function
 * @param {string} baseFilePath
 * @param {Object<'copyResources', Object<string, Array<Object<'src'|'dest', string>>>>} [config={}]
 * @returns {undefined}
 */
export const copyResources = (baseFilePath: string, config: {
  copyResources?: { [key: string]: Array<{ src: string, dest: string }> }
} = {}): void => {
  if (!config.hasOwnProperty('copyResources')) {
    return
  }
  if (!config.copyResources.hasOwnProperty(baseFilePath)) {
    return
  }
  config.copyResources[baseFilePath].forEach(
    (targets: { src: string, dest: string }): void => cpSync(targets.src, targets.dest, { recursive: true })
  )
}

export default copyResources
