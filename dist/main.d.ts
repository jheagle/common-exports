/**
 * Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module common-exports
 */
/// <reference types="node" />
export declare let commonExports: {
    makeCommon: (srcPath: string, destPath: string, config?: {
        [key: string]: {
            [key: string]: any;
        };
    }) => import("stream").Stream;
};
export default commonExports;