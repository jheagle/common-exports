// const makeCommon = require('./src/makeCommon')

// TODO: replace these with valid implementations for building owned and vendor common js files
// const common = () => makeCommon()
// const commonVendor = () => common()
//
// exports.common = common
// exports.commonVendor = commonVendor

const babel = require('gulp-babel')
const { dest, parallel, series, src } = require('gulp')
const { appendFileSync } = require('fs')
const jsdoc2md = require('jsdoc-to-markdown')
const { globSync } = require('glob')
const merge = require('merge2')  // Requires separate installation
const rename = require('gulp-rename')
const { runCLI } = require('jest')
const standard = require('gulp-standard')
const through = require('through2')
const ts = require('gulp-typescript')
const { default: uglify } = require('gulp-uglify-es')
const { removeDirectory } = require('test-filesystem/dist/functions/removeDirectory')

const cleanFolders = ['dist']
const distMain = 'dist/main'
const distSearch = 'dist/**/*js'
const distPath = 'dist'
const srcSearch = 'src/**/*.ts'
const readmeTemplate = 'MAIN.md'
const readmeFile = 'README.md'
const readmePath = './'
const readmeSearch = 'dist/**/*.js'
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
const importReplace = (contents, replaceWith) => {
  const regexImport = new RegExp('(export|import) (.+) from ([\'"])(\./[a-zA-Z-_/]+)(\.[a-z]{2,3})?[\'"]', 'g')
  return contents.replaceAll(regexImport, replaceWith)
}

/**
 * Deletes all the distribution files (used before create a new build).
 * Configure array of directories to remove with 'cleanPaths'.
 * @function
 * @returns {Promise<string[]> | *}
 */
const clean = () => cleanFolders.reduce(
  (promise, path) => promise.then(() => removeDirectory(path)),
  Promise.resolve()
)

/**
 * Starting at the source directory, find all the ts files and convert them into the distribution directory.
 * @function
 * @returns {Function}
 * @see `https://www.typescriptlang.org/docs/handbook/gulp.html` for more info
 */
const typescript = () => {
  const tsResult = src(srcSearch)
    .pipe(ts({
      declaration: true,
      moduleResolution: 'node',
      target: 'es6',
      module: 'es2020'
    }))
  return merge([
    tsResult.dts.pipe(dest(distPath)),
    tsResult.js
      .pipe(through.obj(function (file, enc, cb) {
        file.contents = Buffer.from(importReplace(file.contents.toString(), '$1 $2 from $3$4.mjs$3'))
        this.push(file)
        cb()
      }))
      .pipe(rename({ extname: '.mjs' }))
      .pipe(dest(distPath))
  ])
}

/**
 * Convert to babel files.
 * @function
 * @return {stream.Stream}
 */
const dist = () => src(tsSearch)
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
 * Creates minified versions of the dist files.
 * @function
 * @returns {*}
 */
const distMinify = () => src(distSearch)
  .pipe(uglify())
  .pipe(rename(path => {
    if (path.extname) {
      path.extname = `.min${path.extname}`
    }
  }))
  .pipe(dest(distPath))

/**
 * Work in-progress, need to create a way for converting current project not just a package from node_modules
 * @function
 * @return {*}
 */
const convertToCommon = () => {
  const { makeCommon } = require('./dist/functions/makeCommon')
  const mainFile = `${distMain}.mjs`
  return makeCommon(mainFile, `${distPath}/cjs`, { rootPath: './' })
}

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
const buildReadme = (done = null) => series(createReadme, addToReadme)(done)

/**
 * Run all tests with jest.
 * Configure where tests are located by using 'testPath'.
 * @function
 * @returns {Promise<*>}
 */
const testFull = () => runCLI(testOptions, testPath)

const build = (done = null) => parallel(
  series(
    clean,
    distSeries,
    parallel(distLint, distMinify),
    buildReadme
  ),
  testFull
)(done)

exports.convertCommon = convertToCommon
exports.dist = distSeries
exports.build = build
exports.readme = buildReadme
exports.testFull = testFull
exports.typescript = typescript
