# common-exports
Convert ES Modules (even in dependencies) to CommonJS. Resolves dependency issues and creates both ES and CommonJS module compatibility for packages.

## Modules

<dl>
<dt><a href="#module_common-exports">common-exports</a></dt>
<dd><p>Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#strBeforeLast">strBeforeLast(str, search)</a> ⇒ <code>string</code></dt>
<dd><p>Retrieve the string part after the last search match.
Original source from <a href="https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strBeforeLast.ts">Sí, funciona</a></p>
</dd>
<dt><a href="#strBefore">strBefore(str, search)</a> ⇒ <code>string</code></dt>
<dd><p>Retrieve the string part before the search match.
Original source from <a href="https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strBefore.ts">Sí, funciona</a></p>
</dd>
<dt><a href="#strAfterLast">strAfterLast(str, search)</a> ⇒ <code>string</code></dt>
<dd><p>Retrieve the string part after the last search match.
Original source from <a href="https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strAfterLast.ts">Sí, funciona</a></p>
</dd>
<dt><a href="#strAfter">strAfter(str, search)</a> ⇒ <code>string</code></dt>
<dd><p>Retrieve the string part after the search match.
Original source from <a href="https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strAfter.ts">Sí, funciona</a></p>
</dd>
<dt><a href="#kabobToTitleCase">kabobToTitleCase(str)</a> ⇒ <code>string</code></dt>
<dd><p>Given a string in kebab-case convert to TitleCase (camelCase with a starting capital letter).
Original source concepts from <a href="https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/camelCase.ts">Sí, funciona</a></p>
</dd>
<dt><a href="#wrapAwait">wrapAwait(fileContents, fileName)</a> ⇒ <code>string</code></dt>
<dd><p>Some import / export conversions use await which must be wrapped in an async function.</p>
</dd>
<dt><a href="#resolveModule">resolveModule(root, moduleName, current)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Search for the given module and return the full path.</p>
</dd>
<dt><a href="#resolveMainFile">resolveMainFile(modulePath)</a> ⇒ <code>string</code> | <code>null</code></dt>
<dd><p>Given a module path, find the file which should be used as main, based on module import.</p>
</dd>
<dt><a href="#resolveImports">resolveImports(file)</a> ⇒ <code>Array.&lt;string, Object&gt;</code></dt>
<dd><p>Given a file with buffer contents, identify all the imports it has and find their full paths.</p>
</dd>
<dt><a href="#replaceImports">replaceImports(srcPath, destPath, file, [config])</a> ⇒ <code>reduceImports</code></dt>
<dd><p>Take a srcPath, destPath, and file and return a function to reduce the content for replacing file imports.</p>
</dd>
<dt><a href="#replaceImportMeta">replaceImportMeta(content)</a> ⇒ <code>string</code></dt>
<dd><p>Find usages of import.meta and replace it with CommonJs compatible substitute.</p>
</dd>
<dt><a href="#regexEscape">regexEscape(str)</a> ⇒ <code>string</code></dt>
<dd><p>Take a string and escape the regex characters.</p>
</dd>
<dt><a href="#makeModuleInfo">makeModuleInfo(dirPath, moduleName)</a> ⇒ <code>string</code></dt>
<dd><p>Create the Module Info object to store the name, path, and file.</p>
</dd>
<dt><a href="#makeFilepath">makeFilepath(root, [append])</a> ⇒ <code>string</code></dt>
<dd><p>Format the given path so that it does not have trailing slashes and also correctly appends a path.</p>
</dd>
<dt><a href="#makeCommon">makeCommon(srcPath, destPath, [config])</a> ⇒ <code>stream.Stream</code></dt>
<dd><p>Apply babel to source files and output with commonJs compatibility.</p>
</dd>
<dt><a href="#isCommonModule">isCommonModule(moduleInfo)</a> ⇒ <code>boolean</code></dt>
<dd><p>Attempt to detect if the current module is a common js module.</p>
</dd>
<dt><a href="#importRegex">importRegex()</a> ⇒ <code>string</code></dt>
<dd><p>Get the regex for detecting ES6 import statements.</p>
</dd>
<dt><a href="#findImports">findImports(fileContents)</a> ⇒ <code>Array</code></dt>
<dd><p>Retrieve all the module names from imports.</p>
</dd>
<dt><a href="#fileExists">fileExists(filePath)</a> ⇒ <code>boolean</code></dt>
<dd><p>Detect if a file exists and is usable.</p>
</dd>
<dt><a href="#copyResources">copyResources(baseFilePath, [config])</a> ⇒ <code>undefined</code></dt>
<dd><p>Based on configured &#39;copyResources&#39;, if we are in the corresponding based path copy each src to dest.</p>
</dd>
</dl>

<a name="module_common-exports"></a>

## common-exports
Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.

**Version**: 1.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
<a name="strBeforeLast"></a>

## strBeforeLast(str, search) ⇒ <code>string</code>
Retrieve the string part after the last search match.
Original source from [Sí, funciona](https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strBeforeLast.ts)

**Kind**: global function  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 
| search | <code>string</code> | 

<a name="strBefore"></a>

## strBefore(str, search) ⇒ <code>string</code>
Retrieve the string part before the search match.
Original source from [Sí, funciona](https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strBefore.ts)

**Kind**: global function  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 
| search | <code>string</code> | 

<a name="strAfterLast"></a>

## strAfterLast(str, search) ⇒ <code>string</code>
Retrieve the string part after the last search match.
Original source from [Sí, funciona](https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strAfterLast.ts)

**Kind**: global function  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 
| search | <code>string</code> | 

<a name="strAfter"></a>

## strAfter(str, search) ⇒ <code>string</code>
Retrieve the string part after the search match.
Original source from [Sí, funciona](https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strAfter.ts)

**Kind**: global function  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 
| search | <code>string</code> | 

<a name="kabobToTitleCase"></a>

## kabobToTitleCase(str) ⇒ <code>string</code>
Given a string in kebab-case convert to TitleCase (camelCase with a starting capital letter).
Original source concepts from [Sí, funciona](https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/camelCase.ts)

**Kind**: global function  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="wrapAwait"></a>

## wrapAwait(fileContents, fileName) ⇒ <code>string</code>
Some import / export conversions use await which must be wrapped in an async function.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| fileContents | <code>string</code> |  | 
| fileName | <code>string</code> | <code>&quot;module-namespace&quot;</code> | 

<a name="resolveModule"></a>

## resolveModule(root, moduleName, current) ⇒ <code>Array.&lt;string&gt;</code>
Search for the given module and return the full path.

**Kind**: global function  

| Param | Type |
| --- | --- |
| root | <code>string</code> | 
| moduleName | <code>string</code> | 
| current | <code>string</code> | 

<a name="resolveMainFile"></a>

## resolveMainFile(modulePath) ⇒ <code>string</code> \| <code>null</code>
Given a module path, find the file which should be used as main, based on module import.

**Kind**: global function  

| Param | Type |
| --- | --- |
| modulePath | <code>string</code> | 

<a name="resolveImports"></a>

## resolveImports(file) ⇒ <code>Array.&lt;string, Object&gt;</code>
Given a file with buffer contents, identify all the imports it has and find their full paths.

**Kind**: global function  

| Param | Type |
| --- | --- |
| file | <code>Object</code> | 

<a name="replaceImports"></a>

## replaceImports(srcPath, destPath, file, [config]) ⇒ <code>reduceImports</code>
Take a srcPath, destPath, and file and return a function to reduce the content for replacing file imports.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| srcPath | <code>string</code> |  | 
| destPath | <code>string</code> |  | 
| file | <code>Object</code> |  | 
| [config] | <code>Object.&lt;string, Object.&lt;string, \*&gt;&gt;</code> | <code>{}</code> | 

<a name="replaceImportMeta"></a>

## replaceImportMeta(content) ⇒ <code>string</code>
Find usages of import.meta and replace it with CommonJs compatible substitute.

**Kind**: global function  

| Param | Type |
| --- | --- |
| content | <code>string</code> | 

<a name="regexEscape"></a>

## regexEscape(str) ⇒ <code>string</code>
Take a string and escape the regex characters.

**Kind**: global function  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="makeModuleInfo"></a>

## makeModuleInfo(dirPath, moduleName) ⇒ <code>string</code>
Create the Module Info object to store the name, path, and file.

**Kind**: global function  

| Param | Type |
| --- | --- |
| dirPath | <code>string</code> | 
| moduleName | <code>string</code> | 

<a name="makeFilepath"></a>

## makeFilepath(root, [append]) ⇒ <code>string</code>
Format the given path so that it does not have trailing slashes and also correctly appends a path.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| root | <code>string</code> |  | 
| [append] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 

<a name="makeCommon"></a>

## makeCommon(srcPath, destPath, [config]) ⇒ <code>stream.Stream</code>
Apply babel to source files and output with commonJs compatibility.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| srcPath | <code>string</code> \| <code>array</code> |  | 
| destPath | <code>string</code> |  | 
| [config] | <code>Object.&lt;string, Object.&lt;string, \*&gt;&gt;</code> | <code>{}</code> | 

<a name="isCommonModule"></a>

## isCommonModule(moduleInfo) ⇒ <code>boolean</code>
Attempt to detect if the current module is a common js module.

**Kind**: global function  

| Param | Type |
| --- | --- |
| moduleInfo | <code>Object</code> | 

<a name="importRegex"></a>

## importRegex() ⇒ <code>string</code>
Get the regex for detecting ES6 import statements.

**Kind**: global function  
<a name="findImports"></a>

## findImports(fileContents) ⇒ <code>Array</code>
Retrieve all the module names from imports.

**Kind**: global function  

| Param | Type |
| --- | --- |
| fileContents | <code>string</code> | 

<a name="fileExists"></a>

## fileExists(filePath) ⇒ <code>boolean</code>
Detect if a file exists and is usable.

**Kind**: global function  

| Param | Type |
| --- | --- |
| filePath | <code>string</code> | 

<a name="copyResources"></a>

## copyResources(baseFilePath, [config]) ⇒ <code>undefined</code>
Based on configured 'copyResources', if we are in the corresponding based path copy each src to dest.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| baseFilePath | <code>string</code> |  | 
| [config] | <code>Object.&lt;&#x27;copyResources&#x27;, Object.&lt;string, Array.&lt;Object.&lt;(&#x27;src&#x27;\|&#x27;dest&#x27;), string&gt;&gt;&gt;&gt;</code> | <code>{}</code> | 

