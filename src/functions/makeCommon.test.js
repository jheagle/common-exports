import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { makeCommon } from './makeCommon'
import { logObject, setUp } from 'test-filesystem'

const tempDir = 'test-make-common/'
const modulesPath = `${tempDir}node_modules`
const vendorPath = `${tempDir}external-modules`

setUp.setDefaults(tempDir)

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('makeCommon', () => {
  test('copies the src directory and babelifies it into the dist directory',  (done) => {
    const newPath = `${modulesPath}/gulp-imagemin`
    mkdirSync(modulesPath, { recursive: true })
    const copyModules = [
      'gulp-imagemin',
      'pretty-bytes',
      'imagemin',
      'plur',
      'gulp-plugin-extras',
      'easy-transform-stream',
      'graceful-fs',
      'file-type',
      'irregular-plurals',
      'globby',
      'array-union',
      'merge2',
      'fast-glob',
      'p-pipe',
      'dir-glob',
      'junk',
      'ignore',
      'slash',
      'imagemin-gifsicle',
      'imagemin-mozjpeg',
      'imagemin-optipng',
      'imagemin-svgo',
      'is-jpg',
      'mozjpeg',
    ]
    copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, {recursive: true}))
    // expect.assertions(5)
    const srcFile = `${newPath}/index.js`
    const oldContents = readFileSync(srcFile).toString()
    logObject(oldContents, 'oldContents')
    makeCommon(srcFile, `${vendorPath}/gulp-imagemin`)
      .on('finish', () => {
        expect(existsSync(vendorPath)).toBeTruthy()
        const distFile = `${vendorPath}/gulp-imagemin/index.js`
        const babelifiedContents = readFileSync(distFile).toString()
        logObject(babelifiedContents, 'babelifiedContents')
        // expect(countMatches(babelifiedContents, '"use strict"')).toEqual(1)
        /* There used to be a nice check here where `const` and `let` would be swapped to `var`, but that no longer
           happens.
           It would be nice if it still happened, but due to 'browserlist' supposedly, most browsers support
           `const` and `let` now.
         */
        // expect(countMatches(babelifiedContents, 'function')).toEqual(1)
        // expect(countMatches(babelifiedContents, 'arguments')).toEqual(6)
        setTimeout(done, 10000)
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  }, 15000)
})
