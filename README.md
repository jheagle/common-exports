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

Make sure to use the correct main file you wish to start conversion at and also the output directory for the conversion.

<a name="module_common-exports"></a>

## common-exports
Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.

**Version**: 1.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  

* [common-exports](#module_common-exports)
    * [.makeCommon(srcPath, destPath, [config])](#module_common-exports.makeCommon) ⇒ <code>stream.Stream</code>
    * [.wrapAwait(fileContents, fileName)](#module_common-exports.wrapAwait) ⇒ <code>string</code>
    * [.resolveModule(root, moduleName, current)](#module_common-exports.resolveModule) ⇒ <code>Array.&lt;string&gt;</code>
    * [.resolveMainFile(modulePath)](#module_common-exports.resolveMainFile) ⇒ <code>string</code> \| <code>null</code>
    * [.resolveImports(file, [rootPath])](#module_common-exports.resolveImports) ⇒ <code>Array.&lt;ModuleInfo&gt;</code>
    * [.replaceImports(srcPath, destPath, file, [config])](#module_common-exports.replaceImports) ⇒ <code>reduceImports</code>
    * [.replaceImportMeta(content)](#module_common-exports.replaceImportMeta) ⇒ <code>string</code>
    * [.makeModuleInfo(dirPath, moduleName, rootPath)](#module_common-exports.makeModuleInfo) ⇒ <code>Array.&lt;ModuleInfo&gt;</code>
    * [.isCommonModule(moduleInfo)](#module_common-exports.isCommonModule) ⇒ <code>boolean</code>
    * [.importRegex()](#module_common-exports.importRegex) ⇒ <code>string</code>
    * [.findImports(fileContents)](#module_common-exports.findImports) ⇒ <code>Array</code>
    * [.copyResources(baseFilePath, [config])](#module_common-exports.copyResources) ⇒ <code>undefined</code>

<a name="module_common-exports.makeCommon"></a>

### common-exports.makeCommon(srcPath, destPath, [config]) ⇒ <code>stream.Stream</code>
Apply babel to source files and output with commonJs compatibility.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| srcPath | <code>string</code> \| <code>array</code> |  | The relative path to the file to convert |
| destPath | <code>string</code> |  | The relative path to the output directory |
| [config] | <code>Object.&lt;string, \*&gt;</code> | <code>{}</code> | Add additional instructions to the process |
| [config.copyResources] | <code>Object.&lt;string, Array.&lt;Object.&lt;(src\|dest), string&gt;&gt;&gt;</code> | <code>{}</code> | Add custom files to copy for found modules |
| [config.rootPath] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Specify the root to use, this helps identify where to stop |

<a name="module_common-exports.wrapAwait"></a>

### common-exports.wrapAwait(fileContents, fileName) ⇒ <code>string</code>
Some import / export conversions use await which must be wrapped in an async function.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fileContents | <code>string</code> |  | The string content of the file for updating. |
| fileName | <code>string</code> | <code>&quot;module-namespace&quot;</code> | The name of the file we are doing changes for. |

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
Given a file with buffer contents, identify all the imports it has and find their full paths.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| file | <code>StreamFile</code> |  | The in-memory fetched file object. |
| [rootPath] | <code>string</code> \| <code>null</code> | <code>null</code> | The root path to use when resolving imports. |

<a name="module_common-exports.replaceImports"></a>

### common-exports.replaceImports(srcPath, destPath, file, [config]) ⇒ <code>reduceImports</code>
Take a srcPath, destPath, and file and return a function to reduce the content for replacing file imports.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| srcPath | <code>string</code> |  | The original path of the file to be updated. |
| destPath | <code>string</code> |  | The outgoing path of the file once updated. |
| file | <code>StreamFile</code> |  | The in-memory fetched file object. |
| [config] | <code>Object.&lt;string, Object.&lt;string, \*&gt;&gt;</code> | <code>{}</code> | Additional configuration options. |

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
| moduleInfo | <code>Object.&lt;(module\|path\|file), (string\|null)&gt;</code> | An object containing the module, path, and file strings. |

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

<a name="module_common-exports.copyResources"></a>

### common-exports.copyResources(baseFilePath, [config]) ⇒ <code>undefined</code>
Based on configured 'copyResources', if we are in the corresponding based path copy each src to dest.

**Kind**: static method of [<code>common-exports</code>](#module_common-exports)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| baseFilePath | <code>string</code> |  | The source / module path to process. |
| [config] | <code>Object.&lt;&#x27;copyResources&#x27;, Object.&lt;string, Array.&lt;Object.&lt;(&#x27;src&#x27;\|&#x27;dest&#x27;), string&gt;&gt;&gt;&gt;</code> | <code>{}</code> | The copyResources config may be present and if it has the source path as a property, then the src and dest will be used to copy resources. |

