const babelConfig = require('js-build-tools/babel.config')
babelConfig.presets.push('@babel/preset-typescript')
babelConfig.plugins.push('@babel/plugin-proposal-throw-expressions')
module.exports = babelConfig
