import { dest, src } from 'gulp'
const babel = require('gulp-babel')
/**
 * Apply babel to source files and output with commonJs compatibility.
 * @param {string|array} srcPath
 * @param {string} destPath
 * @return {stream.Stream}
 */
export const makeCommon = (srcPath, destPath) => src(srcPath)
  .pipe(babel())
  .pipe(dest(destPath))
export default makeCommon
