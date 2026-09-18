/**
 * Detect whether file content has any ES module import/export syntax at all. This is deliberately broader than
 * importRegex/findImports, which only match `import`/`export ... from '...'` statements (needed to extract a
 * dependency's module name) - a bare `export default ...` or `export const foo = ...` has no "from" clause and
 * would otherwise go undetected, even though it's still ESM syntax that needs converting.
 * @memberof module:common-exports
 * @param {string} content - The file content to check.
 * @returns {boolean}
 */
export const hasEsmSyntax = (content) => /^\s*(export|import)\s/m.test(content)
