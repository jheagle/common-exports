import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { makeFilepath } from '../utilities/makeFilepath.mjs'
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
export const stripEsmType = (destPath) => {
  for (const entry of readdirSync(destPath, { withFileTypes: true })) {
    const entryPath = makeFilepath(destPath, entry.name)
    if (entry.isDirectory()) {
      stripEsmType(entryPath)
      continue
    }
    if (entry.name !== 'package.json') {
      continue
    }
    const content = readFileSync(entryPath).toString()
    const packageData = JSON.parse(content)
    if (packageData.type !== 'module') {
      continue
    }
    delete packageData.type
    // Parsing and re-serializing (rather than a regex replace on the raw text) is robust regardless of the
    // original formatting - tabs vs spaces, a trailing comma or none if "type" happened to be the last
    // property, even minified single-line JSON with no whitespace at all. This is vendor output, not
    // hand-maintained source, so normalizing to a plain 2-space indent instead of preserving whatever the
    // original used is an acceptable trade-off for that robustness.
    writeFileSync(entryPath, JSON.stringify(packageData, null, 2) + '\n')
  }
}
