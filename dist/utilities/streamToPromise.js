'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.streamToPromise = void 0
/**
 * Wrap a stream so its completion (or failure) can be awaited.
 * @memberof module:common-exports
 * @param {stream.Stream} streamToWrap
 * @returns {Promise<void>}
 */
const streamToPromise = streamToWrap => new Promise((resolve, reject) => {
  streamToWrap.on('finish', resolve)
  streamToWrap.on('error', reject)
})
exports.streamToPromise = streamToPromise
