'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = exports.copyResources = void 0
require('core-js/modules/esnext.async-iterator.for-each.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.for-each.js')
var _fs = require('fs')
/**
 * Based on configured 'copyResources', if we are in the corresponding based path copy each src to dest.
 * @memberof module:common-exports
 * @param {string} baseFilePath - The source / module path to process.
 * @param {Object<'copyResources', Object<string, Array<Object<'src'|'dest', string>>>>} [config={}] -
 * The copyResources config may be present and if it has the source path as a property,
 * then the src and dest will be used to copy resources.
 * @returns {undefined}
 */
const copyResources = (baseFilePath, config = {}) => {
  if (!config.hasOwnProperty('copyResources')) {
    return
  }
  if (!config.copyResources.hasOwnProperty(baseFilePath)) {
    return
  }
  config.copyResources[baseFilePath].forEach(targets => (0, _fs.cpSync)(targets.src, targets.dest, {
    recursive: true
  }))
}
exports.copyResources = copyResources
var _default = exports.default = copyResources
