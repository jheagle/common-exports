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
 * @param {string} baseFilePath
 * @param {Object<'copyResources', Object<string, Array<Object<'src'|'dest', string>>>>} [config={}]
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
