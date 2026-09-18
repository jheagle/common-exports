import * as stream from 'stream'

/**
 * Wrap a stream so its completion (or failure) can be awaited.
 * @param {stream.Stream} streamToWrap
 * @returns {Promise<void>}
 */
export const streamToPromise = (streamToWrap: stream.Stream): Promise<void> => new Promise(
  (resolve, reject) => {
    streamToWrap.on('finish', resolve)
    streamToWrap.on('error', reject)
  }
)
