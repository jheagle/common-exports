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

* [common-exports](#module_common-exports)
    * [.makeCommon(srcPath, destPath, [config], [inProgress], [ancestors])](#module_common-exports.makeCommon) ⇒ <code>stream.Stream</code>
    * [.verifyModule(moduleName, current)](#module_common-exports.verifyModule) ⇒ <code>Array.&lt;string&gt;</code> \| <code>null</code>
    * [.resolvePackageExports(packageData, modulePath)](#module_common-exports.resolvePackageExports) ⇒ <code>string</code> \| <code>null</code>
    * [.resolveModule(root, moduleName, current)](#module_common-exports.resolveModule) ⇒ <code>Array.&lt;string&gt;</code>
    * [.resolveMainFile(modulePath)](#module_common-exports.resolveMainFile) ⇒ <code>string</code> \| <code>null</code>
    * [.resolveImports(file, [rootPath])](#module_common-exports.resolveImports) ⇒ <code>Array.&lt;ModuleInfo&gt;</code>
    * [.replaceImports(srcPath, destPath, [config], [pending], [inProgress], [ancestors])](#module_common-exports.replaceImports) ⇒ <code>reduceImports</code>
    * [.replaceImportMeta(content)](#module_common-exports.replaceImportMeta) ⇒ <code>string</code>
    * [.makeModuleInfo(dirPath, moduleName, rootPath)](#module_common-exports.makeModuleInfo) ⇒ <code>Array.&lt;ModuleInfo&gt;</code>
    * [.isCommonModule(moduleInfo)](#module_common-exports.isCommonModule) ⇒ <code>boolean</code>
    * [.importRegex()](#module_common-exports.importRegex) ⇒ <code>string</code>
    * [.findImports(fileContents)](#module_common-exports.findImports) ⇒ <code>Array</code>
    * [.customChanges(baseFilePath, content, [config])](#module_common-exports.customChanges) ⇒ <code>string</code>
    * [.copyResources(baseFilePath, [config])](#module_common-exports.copyResources) ⇒ <code>undefined</code>
    * [.checkPackageExports(exports, modulePath)](#module_common-exports.checkPackageExports) ⇒ <code>string</code> \| <code>null</code>

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

<a name="module_common-exports.verifyModule"></a>

### common-exports.verifyModule(moduleName, current) ⇒ <code>Array.&lt;string&gt;</code> \| <code>null</code>
Check if the current path contains the module we are looking for.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type |
| --- | --- |
| moduleName | <code>string</code> | 
| current | <code>string</code> | 

<a name="module_common-exports.resolvePackageExports"></a>

### common-exports.resolvePackageExports(packageData, modulePath) ⇒ <code>string</code> \| <code>null</code>
Given the package details, determined the configured module entry point.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Description |
| --- | --- | --- |
| packageData | <code>object</code> \| <code>string</code> | The package contents as an object. |
| modulePath | <code>string</code> |  |

<a name="module_common-exports.resolveModule"></a>

### common-exports.resolveModule(root, moduleName, current) ⇒ <code>Array.&lt;string&gt;</code>
Search for the given module and return the full path.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Description |
| --- | --- | --- |
| root | <code>string</code> | The base path for searching. |
| moduleName | <code>string</code> | The import name used for retrieving the module. |
| current | <code>string</code> | The current directory we are checking for module matches. |

<a name="module_common-exports.resolveMainFile"></a>

### common-exports.resolveMainFile(modulePath) ⇒ <code>string</code> \| <code>null</code>
Given a module path, find the file which should be used as main, based on module import.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Description |
| --- | --- | --- |
| modulePath | <code>string</code> | The relative path used to locate the module. |

<a name="module_common-exports.resolveImports"></a>

### common-exports.resolveImports(file, [rootPath]) ⇒ <code>Array.&lt;ModuleInfo&gt;</code>
Given a file with buffer contents, identify all the imports it has and find their full paths. Common (already
CommonJS-compatible) modules are included too, not just modules needing conversion - see [ModuleInfo](ModuleInfo)'s
isCommon flag, used by [replaceImports](replaceImports) to copy them into the vendor tree as-is rather than converting
them. They can't simply be left alone: the vendor output directory structure doesn't mirror the original
node_modules layout closely enough for Node's own module resolution to find them from their new location.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| file | <code>StreamFile</code> |  | The in-memory fetched file object. |
| [rootPath] | <code>string</code> \| <code>null</code> | <code>null</code> | The root path to use when resolving imports. |

<a name="module_common-exports.replaceImports"></a>

### common-exports.replaceImports(srcPath, destPath, [config], [pending], [inProgress], [ancestors]) ⇒ <code>reduceImports</code>
Take a srcPath, destPath, then return a function to reduce the content for replacing file imports.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| srcPath | <code>string</code> |  | The original path of the file to be updated. |
| destPath | <code>string</code> |  | The outgoing path of the file once updated. |
| [config] | <code>Object.&lt;string, Object.&lt;string, \*&gt;&gt;</code> | <code>{}</code> | Additional configuration options. |
| [pending] | <code>Array.&lt;Promise.&lt;void&gt;&gt;</code> | <code>[]</code> | Recursive conversions started for discovered imports are pushed here as promises, so the caller can await them before considering the current file done. makeCommon's own recursive calls don't block; without this, a file could be reported "finished" before its own dependencies (or their dependencies, arbitrarily deep) have actually finished being written. |
| [inProgress] | <code>Map.&lt;string, Promise.&lt;void&gt;&gt;</code> | <code>new Map()</code> | Tracks recursive conversions already started (by destination path), shared across the whole call tree. A dependency reachable from multiple import chains would otherwise be independently, redundantly re-converted every time it's encountered again while its first conversion is still in flight (the fileExists check below can't catch this - the file isn't written yet) - each duplicate spawning its own full sub-tree of further duplicates, which is what caused this function's historical OOM crash. Reusing the same in-flight promise instead of starting a new one avoids that entirely. |
| [ancestors] | <code>Set.&lt;string&gt;</code> | <code>new Set()</code> | Source files currently being converted above this one, in this same branch. Real packages can have genuine circular imports (two files that import each other) - waiting for such a target's conversion to finish before this file is done would deadlock, since its own conversion is simultaneously waiting on this one. A target already in this set is already in flight further up the same chain - don't wait on it again here. |

<a name="module_common-exports.replaceImportMeta"></a>

### common-exports.replaceImportMeta(content) ⇒ <code>string</code>
Find usages of import.meta and replace it with CommonJs compatible substitute.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | String of file contents to search for import.meta usage. |

<a name="module_common-exports.makeModuleInfo"></a>

### common-exports.makeModuleInfo(dirPath, moduleName, rootPath) ⇒ <code>Array.&lt;ModuleInfo&gt;</code>
Create the Module Info object to store the name, path, and file for each matching module.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dirPath | <code>string</code> |  | Current relative directory to search. |
| moduleName | <code>string</code> |  | Path used in the import for the module. |
| rootPath | <code>string</code> | <code>null</code> | The lowest path to search within for the module. |

<a name="module_common-exports.isCommonModule"></a>

### common-exports.isCommonModule(moduleInfo) ⇒ <code>boolean</code>
Attempt to detect if the current module is a common js module.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Description |
| --- | --- | --- |
| moduleInfo | <code>Object.&lt;(path\|file), (string\|null)&gt;</code> | An object containing the path and file strings. |

<a name="module_common-exports.importRegex"></a>

### common-exports.importRegex() ⇒ <code>string</code>
Get the regex for detecting ES6 import statements.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  
<a name="module_common-exports.findImports"></a>

### common-exports.findImports(fileContents) ⇒ <code>Array</code>
Retrieve all the module names from imports.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Description |
| --- | --- | --- |
| fileContents | <code>string</code> | The string of contents to parse for import matches. |

<a name="module_common-exports.customChanges"></a>

### common-exports.customChanges(baseFilePath, content, [config]) ⇒ <code>string</code>
Based on configured 'customChanges', if we are in the corresponding based path, apply the change function to the content.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| baseFilePath | <code>string</code> |  | The source / module path to process. |
| content | <code>string</code> |  | The file content which will receive changes. |
| [config] | <code>Object.&lt;&#x27;customChanges&#x27;, Object.&lt;string, Array.&lt;Object.&lt;&#x27;updateContent&#x27;, function()&gt;&gt;&gt;&gt;</code> | <code>{}</code> | The customChanges config may be present, and if it has the source path as a property, then the updateContent function will be applied to the contents. |

<a name="module_common-exports.copyResources"></a>

### common-exports.copyResources(baseFilePath, [config]) ⇒ <code>undefined</code>
Based on configured 'copyResources', if we are in the corresponding based path copy each src to dest.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| baseFilePath | <code>string</code> |  | The source / module path to process. |
| [config] | <code>Object.&lt;&#x27;copyResources&#x27;, Object.&lt;string, Array.&lt;Object.&lt;(&#x27;src&#x27;\|&#x27;dest&#x27;\|&#x27;updateContent&#x27;), (string\|function())&gt;&gt;&gt;&gt;</code> | <code>{}</code> | The copyResources config may be present, and if it has the source path as a property, then the src and dest will be used to copy resources. |

<a name="module_common-exports.checkPackageExports"></a>

### common-exports.checkPackageExports(exports, modulePath) ⇒ <code>string</code> \| <code>null</code>
Given the configured exports from a package, determine the preferred entry path.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Description |
| --- | --- | --- |
| exports | <code>object</code> \| <code>string</code> | The relative path used to locate the module. |
| modulePath | <code>string</code> |  |

