const babelConfig = require('js-build-tools/babel.config')
babelConfig.plugins.push('@babel/plugin-proposal-throw-expressions')
module.exports = babelConfig
