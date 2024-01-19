/**
 * Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module common-exports
 */
import makeCommon from './functions/makeCommon'
export const commonExports = {
  makeCommon
}
export default commonExports
if (this) {
  // @ts-ignore
  this.commonExports = commonExports
} else if (typeof window !== 'undefined') {
  // @ts-ignore
  window.commonExports = commonExports
}
