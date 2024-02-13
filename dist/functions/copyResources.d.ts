import { makeCommonConfig } from '../main';
/**
 * Based on configured 'copyResources', if we are in the corresponding based path copy each src to dest.
 * @memberof module:common-exports
 * @param {string} baseFilePath - The source / module path to process.
 * @param {Object<'copyResources', Object<string, Array<Object<'src'|'dest'|'updateContent', string|Function>>>>} [config={}] -
 * The copyResources config may be present, and if it has the source path as a property,
 * then the src and dest will be used to copy resources.
 * @returns {undefined}
 */
export declare const copyResources: (baseFilePath: string, config?: makeCommonConfig) => void;
