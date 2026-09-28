/**
 * Based on configured 'customChanges', if we are in the corresponding based path, apply the change function to the content.
 * @memberof module:common-exports
 * @param baseFilePath - The source / module path to process.
 * @param content - The file content which will receive changes.
 * @param config -
 * The customChanges config may be present, and if it has the source path as a property,
 * then the updateContent function will be applied to the contents.
 */
export const customChanges = (baseFilePath, content, config = {}) => {
  if (!config.hasOwnProperty('customChanges')) {
    return content
  }
  if (!config.customChanges.hasOwnProperty(baseFilePath)) {
    return content
  }
  return config.customChanges[baseFilePath].reduce((newContent, targets) => {
    if (targets.updateContent) {
      newContent = targets.updateContent(newContent)
    }
    return newContent
  }, content)
}
