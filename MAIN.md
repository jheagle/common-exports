# common-exports
Convert ES Modules (even in dependencies) to CommonJS. Resolves dependency issues and creates both ES and CommonJS module compatibility for packages.

### Goals

Using this tool suite, you can:

* Convert packages in node_modules from es6 Module into cloned CommonJs module (this will be stored in a directory of your choosing)
* Convert your own project from es6 Module into cloned CommonJs module, so you can distribute more compatible code

## Installation

In your project's root directory, run: `npm install --save-dev gulp common-exports`
(or `yarn add --dev gulp common-exports` if you use Yarn).

It is recommended to install gulp with the `-g` flag, so that you can run it with `gulp` instead
of `node_modules/.bin/gulp`.

## Usage

In your `gulpfile.js` add the following:

```js
const convertCommon = () => {
  const { makeCommon } = require('common-exports')
  const mainFile = 'path to the main file you wish to convert'
  const vendorPath = 'path to the directory where your exported file (and dependencies) should go'
  return makeCommon(mainFile, vendorPath, { rootPath: './' })
}

exports.convertCommon = convertCommon
```

Create a `babel.config.js` file if you do not already have one and add the following content:
```js
module.exports = {
  plugins: [
    '@babel/plugin-transform-modules-commonjs'
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: { version: '3.6', proposals: true },
        targets: { node: 'current' }
      }
    ]
  ]
}

```
The import configuration above is the use of the `plugin-transform-modules-commonjs` plugin
since that will do the major work of converting each file.

If you are copying packages from `node_modules`,
ensure that you change your .gitignore for `node_modules` to be `/node_modules`
instead to allow subdirectories to be included if you need them bundled.

Make sure to use the correct main file you wish to start conversion at and also the output directory for the conversion.

