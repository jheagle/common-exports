/**
 * Wrap a stream so its completion (or failure) can be awaited.
 * @param streamToWrap
 */
export const streamToPromise = (streamToWrap: NodeJS.ReadWriteStream): Promise<void> => new Promise(
  (resolve, reject) => {
    streamToWrap.on('finish', resolve)
    streamToWrap.on('error', reject)
  }
)
