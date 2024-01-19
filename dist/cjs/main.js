'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = exports.commonExports = void 0
var _makeCommon = _interopRequireDefault(require('./functions/makeCommon'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module common-exports
 */

const commonExports = exports.commonExports = {
  makeCommon: _makeCommon.default
}
var _default = exports.default = commonExports
if (void 0) {
  // @ts-ignore
  (void 0).commonExports = commonExports
} else if (typeof window !== 'undefined') {
  // @ts-ignore
  window.commonExports = commonExports
}
