/**
 * Based on configured 'copyResources', if we are in the corresponding based path copy each src to dest.
 * @param {string} baseFilePath
 * @param {Object<'copyResources', Object<string, Array<Object<'src'|'dest', string>>>>} [config={}]
 * @returns {undefined}
 */
export declare const copyResources: (baseFilePath: string, config?: {
    copyResources?: {
        [key: string]: {
            src: string;
            dest: string;
        }[];
    };
}) => void;
export default copyResources;
