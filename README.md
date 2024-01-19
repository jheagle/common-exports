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
<dt><a href="#makeCommon">makeCommon(srcPath, destPath)</a> ⇒ <code>stream.Stream</code></dt>
<dd><p>Apply babel to source files and output with commonJs compatibility.</p>
</dd>
</dl>

<a name="module_common-exports"></a>

## common-exports
Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.

**Version**: 1.0.0  
**Author**: Joshua Heagle <joshuaheagle@gmail.com>  
<a name="makeCommon"></a>

## makeCommon(srcPath, destPath) ⇒ <code>stream.Stream</code>
Apply babel to source files and output with commonJs compatibility.

**Kind**: global function  

| Param | Type |
| --- | --- |
| srcPath | <code>string</code> \| <code>array</code> | 
| destPath | <code>string</code> | 

