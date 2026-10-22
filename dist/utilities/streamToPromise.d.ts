/**
 * Wrap a stream so its completion (or failure) can be awaited.
 * @param streamToWrap
 */
export declare const streamToPromise: (streamToWrap: NodeJS.ReadWriteStream) => Promise<void>;
