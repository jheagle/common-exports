import * as stream from 'stream';
/**
 * Wrap a stream so its completion (or failure) can be awaited.
 * @param {stream.Stream} streamToWrap
 * @returns {Promise<void>}
 */
export declare const streamToPromise: (streamToWrap: stream.Stream) => Promise<void>;
