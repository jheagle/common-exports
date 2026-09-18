/**
 * Wrap a stream so its completion (or failure) can be awaited.
 * @param {stream.Stream} streamToWrap
 * @returns {Promise<void>}
 */
export const streamToPromise = (streamToWrap) => new Promise((resolve, reject) => {
  streamToWrap.on('finish', resolve)
  streamToWrap.on('error', reject)
})
