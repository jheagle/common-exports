/**
 * Recursively walk a directory and strip any lingering `"type": "module"` from every package.json found. The
 * entire point of makeCommon's output is CommonJS compatibility, so no package.json anywhere under it should
 * ever declare "type": "module" - yet one can slip through: when a privately-nested isCommon package's whole
 * parent directory gets copied wholesale (see replaceImports.ts), that copy carries along any ESM sibling's
 * original, unconverted package.json even when that sibling's own .js content gets correctly, individually
 * converted to CommonJS elsewhere in the same pass - the wholesale copy has no way to tell common and ESM
 * siblings apart. The result is a directory where the .js content is valid CommonJS but the nearest package.json
 * still says "type": "module", so Node refuses to require() it. This sweep, run once after the whole output tree
 * is otherwise complete, catches and fixes any of these mismatches without needing to enumerate every affected
 * package by hand.
 * @memberof module:common-exports
 * @param {string} destPath - The root directory to sweep.
 * @returns {undefined}
 */
export declare const stripEsmType: (destPath: string) => void;
