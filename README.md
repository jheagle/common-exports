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

<a name="module_common-exports"></a>

## common-exports
Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.

**Version**: 1.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
<a name="module_common-exports.makeCommon"></a>

### common-exports.makeCommon(srcPath, destPath, [config], [inProgress], [ancestors]) ⇒ <code>stream.Stream</code>
Apply babel to source files and output with commonJs compatibility.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| srcPath | <code>string</code> \| <code>array</code> |  | The relative path to the file to convert. |
| destPath | <code>string</code> |  | The relative path to the output directory. |
| [config] | <code>Object.&lt;string, \*&gt;</code> | <code>{}</code> | Add additional instructions to the process. |
| [config.copyResources] | <code>Object.&lt;string, Array.&lt;Object.&lt;(src\|dest\|updateContent), (string\|function())&gt;&gt;&gt;</code> | <code>{}</code> | Add custom files to copy for found modules. |
| [config.customChanges] | <code>Object.&lt;string, Array.&lt;Object.&lt;updateContent, function()&gt;&gt;&gt;</code> | <code>{}</code> | Add custom content changes to the content used. |
| [config.rootPath] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Specify the root to use, this helps identify where to stop. |
| [inProgress] | <code>Map.&lt;string, Promise.&lt;void&gt;&gt;</code> | <code>new Map()</code> | Tracks recursive conversions already started (by destination path) for this whole call tree, shared across every recursive makeCommon call it spawns. Without this, the same dependency reachable from multiple import chains (a very common shape once a tree gets deep or wide) gets independently, redundantly re-converted - each duplicate spawning its own full sub-tree of further duplicates - which is what caused this function's historical OOM crash under real-world dependency graphs. |
| [ancestors] | <code>Set.&lt;string&gt;</code> | <code>new Set()</code> | The chain of source files currently being converted above this call, in this same branch of the recursion. Real packages do have genuine circular imports (e.g. two files that import from each other) - CommonJS/Node handle that fine at runtime via partial exports, but this function cannot: waiting for a circular dependency's own conversion to finish before considering the current file done would deadlock (each side waiting on the other) forever. When a discovered import's target is already an ancestor, its conversion is already in flight further up this same chain - don't wait on it here too. |

