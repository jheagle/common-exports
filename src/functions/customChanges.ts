import { makeCommonConfig, updateContentCallback } from '../main'

/**
 * Based on configured 'customChanges', if we are in the corresponding based path, apply the change function to the content.
 * @memberof module:common-exports
 * @param {string} baseFilePath - The source / module path to process.
 * @param {string} content - The file content which will receive changes.
 * @param {Object<'customChanges', Object<string, Array<Object<'updateContent', Function>>>>} [config={}] -
 * The customChanges config may be present, and if it has the source path as a property,
 * then the updateContent function will be applied to the contents.
 * @returns {string}
 */
export const customChanges = (baseFilePath: string, content: string, config: makeCommonConfig = {}): string => {
  if (!config.hasOwnProperty('customChanges')) {
    return content
  }
  if (!config.customChanges.hasOwnProperty(baseFilePath)) {
    return content
  }
  return config.customChanges[baseFilePath].reduce(
    (newContent: string, targets: { updateContent: updateContentCallback }): string => {
      if (targets.updateContent) {
        newContent = targets.updateContent(newContent)
      }
      return newContent
    },
    content
  )
}
