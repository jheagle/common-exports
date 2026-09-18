import Module from 'node:module'
import { dest, parallel, series, src } from 'gulp'
import { appendFileSync } from 'fs'
import { globSync } from 'glob'
import babel from 'gulp-babel'
import jsdoc2md from 'jsdoc-to-markdown'
import rename from 'gulp-rename'
import { runCLI } from 'jest'
import standard from 'gulp-standard'
import through from 'through2'
import ts from 'gulp-typescript'
import { removeDirectory } from 'test-filesystem'

// Only used to load our own just-built dist/main.js (a CommonJS file this project generates itself) inside
// convertCommon below - unlike every dependency above, that's never at risk of becoming ESM-only, so a plain
// require() there is simpler than juggling a dynamic import()'s async/stream-completion semantics inside a gulp
// task that needs to return a stream synchronously.
const require = Module.createRequire(import.meta.url)

const cleanFolders = ['dist']
const distMain = 'dist/main'
const distSearch = 'dist/**/*js'
const distPath = 'dist'
const srcSearch = 'src/**/*.ts'
const readmeTemplate = 'MAIN.md'
const readmeFile = 'README.md'
const readmePath = './'
// Only the public entry point (makeCommon and its config) belongs in the README - functions/ and utilities/ are
// internal implementation details, documented in-source for contributors but not part of the published API
// (see package.json's "exports", which only publishes dist/main.js/.mjs).
const readmeSearch = ['dist/main.js']
const readmeOptions = 'utf8'
const testPath = ['src']
const testOptions = {
  clearCache: false,
  debug: false,
  ignoreProjects: false,
  json: false,
  selectProjects: false,
  showConfig: false,
  useStderr: false,
  watch: false,
  watchAll: false,
}
const tsSearch = `${distPath}/**/*.mjs`

/**
 * Replace parts of the import statements.
 * @function
 * @param {string} contents
 * @param {string} replaceWith
 * @return {string}
 */
const importReplace = (contents, replaceWith) => contents
  .replaceAll(
    /(export|import) ({?.+}?) from (['"])(\.+\/[a-zA-Z-_\/]+)(\.[a-z]{2,3})?['"]/g,
    replaceWith
  )

/**
 * Deletes all the distribution files (used before create a new build).
 * Configure array of directories to remove with 'cleanPaths'.
 * @function
 * @returns {Promise<string[]> | *}
 */
export const clean = () => cleanFolders.reduce(
  (promise, path) => promise.then(() => removeDirectory(path)),
  Promise.resolve()
)

/**
 * Starting at the source directory, find all the ts files and convert them into the distribution directory.
 * @function
 * @returns {Function}
 * @see `https://www.typescriptlang.org/docs/handbook/gulp.html` for more info
 */
export const typescript = () => {
  const tsResult = src(srcSearch)
    .pipe(ts({
      declaration: true,
      moduleResolution: 'node',
      target: 'es6',
      module: 'es2020'
    }))
  tsResult.dts.pipe(dest(distPath))
  return tsResult.js
    .pipe(through.obj(function (file, enc, cb) {
      file.contents = Buffer.from(importReplace(file.contents.toString(), '$1 $2 from $3$4.mjs$3'))
      this.push(file)
      cb()
    }))
    .pipe(rename({ extname: '.mjs' }))
    .pipe(dest(distPath))
}

/**
 * Convert to babel files.
 * @function
 * @return {stream.Stream}
 */
export const dist = () => src(tsSearch)
  .pipe(through.obj(function (file, enc, cb) {
    file.contents = Buffer.from(importReplace(file.contents.toString(), '$1 $2 from $3$4$3'))
    this.push(file)
    cb()
  }))
  .pipe(babel())
  .pipe(dest(distPath))

/**
 * When using TypeScript, ensure that we process the ts first then run babel (dist)
 * @function
 * @returns {function(null=): stream.Stream}
 */
const distSeries = (done = null) => series(typescript, dist)(done)

/**
 * Applies Standard code style linting to distribution files.
 * @function
 * @returns {*}
 */
const distLint = () => src(distSearch)
  .pipe(standard({ fix: true }))
  .pipe(standard.reporter('default', {
    fix: true,
    quiet: true
  }))
  .pipe(dest(distPath))

/**
 * Copy a readme template into the README.md file.
 * @function
 * @returns {*}
 */
const createReadme = () => src(readmeTemplate)
  .pipe(rename(readmeFile))
  .pipe(dest(readmePath))

/**
 * Appends all the jsdoc comments to the readme file. Assumes empty or templated file.
 * Configure this with 'readmeSearch', 'readmePath', 'readmeFile', and 'readmeOptions'.
 * @function
 * @returns {string|Uint8Array}
 */
const addToReadme = () => jsdoc2md
  .render({ files: globSync(readmeSearch) })
  .then(
    readme => appendFileSync(readmePath + readmeFile, readme, readmeOptions)
  )

/**
 * Generate the readme file.
 * @function
 * @return {*}
 */
export const readme = (done = null) => series(createReadme, addToReadme)(done)

/**
 * Run all tests with jest.
 * Configure where tests are located by using 'testPath'.
 * @function
 * @returns {Promise<*>}
 */
export const testFull = () => runCLI(testOptions, testPath)

export const build = (done = null) => parallel(
  series(
    clean,
    distSeries,
    distLint,
    readme
  ),
  testFull
)(done)

export const convertCommon = () => {
  const { makeCommon } = require('./dist/main')
  return makeCommon(`${distMain}.mjs`, `${distPath}/cjs`, { rootPath: './' })
}
