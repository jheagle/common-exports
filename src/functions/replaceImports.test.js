import { replaceImports } from './replaceImports'
import { countMatches } from 'test-filesystem'
import { makeCommon } from '../main'
import { readFileSync } from 'fs'

jest.mock('../main', () => ({ makeCommon: jest.fn() }))

const fileContents = 'import path from \'node:path\';\n' +
  'import process from \'node:process\';\n' +
  'import prettyBytes from \'pretty-bytes\';\n' +
  'import chalk from \'chalk\';\n' +
  'import imagemin from \'imagemin\';\n' +
  'import plur from \'plur\';\n' +
  'import {gulpPlugin} from \'gulp-plugin-extras\';\n' +
  '\n' +
  'const PLUGIN_NAME = \'gulp-imagemin\';\n' +
  'const defaultPlugins = [\'gifsicle\', \'mozjpeg\', \'optipng\', \'svgo\'];\n' +
  '\n' +
  'const loadPlugin = async (pluginName, ...arguments_) => {\n' +
  '\ttry {\n' +
  '\t\tconst {default: plugin} = await import(`imagemin-${pluginName}`);\n' +
  '\t\treturn plugin(...arguments_);\n' +
  '\t} catch (error) {\n' +
  '\t\tconsole.log(\'er\', error);\n' +
  '\t\tconsole.log(`${PLUGIN_NAME}: Could not load default plugin \\`${pluginName}\\``);\n' +
  '\t}\n' +
  '};\n' +
  '\n' +
  'const exposePlugin = async plugin => (...arguments_) => loadPlugin(plugin, ...arguments_);\n' +
  '\n' +
  'const getDefaultPlugins = async () => Promise.all(defaultPlugins.flatMap(plugin => loadPlugin(plugin)));\n'

const anotherFile = 'import {Buffer} from \'node:buffer\';\n' +
  'import path from \'node:path\';\n' +
  'import childProcess from \'node:child_process\';\n' +
  'import process from \'node:process\';\n' +
  'import crossSpawn from \'cross-spawn\';\n' +
  'import stripFinalNewline from \'strip-final-newline\';\n' +
  'import {npmRunPathEnv} from \'npm-run-path\';\n' +
  'import onetime from \'onetime\';\n' +
  'import {makeError} from \'./lib/error.js\';\n' +
  'import {normalizeStdio, normalizeStdioNode} from \'./lib/stdio.js\';\n' +
  'import {spawnedKill, spawnedCancel, setupTimeout, validateTimeout, setExitHandler} from \'./lib/kill.js\';\n' +
  'import {handleInput, getSpawnedResult, makeAllStream, validateInputSync} from \'./lib/stream.js\';\n' +
  'import {mergePromise, getSpawnedPromise} from \'./lib/promise.js\';\n' +
  'import {joinCommand, parseCommand, getEscapedCommand} from \'./lib/command.js\';\n' +
  '\n' +
  'const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;\n'

describe('replaceImports', () => {
  test('will replace all the found imports with correct relative paths', () => {
    const srcPath = 'test-replace-imports/node_modules/gulp-imagemin/index.js'
    const destPath = 'test-replace-imports/external-modules/gulp-imagemin'
    const file = {
      base: '/common-exports/test-replace-imports/node_modules/gulp-imagemin',
      contents: Buffer.from(fileContents),
      cwd: '/common-exports',
      history: [
        '/common-exports/test-replace-imports/node_modules/gulp-imagemin/index.js'
      ],
      isVinyl: undefined,
      path: '/common-exports/test-replace-imports/node_modules/gulp-imagemin/index.js',
      stat: {}
    }
    const importFiles = [
      {
        module: 'pretty-bytes',
        path: 'test-replace-imports/node_modules/pretty-bytes',
        file: 'test-replace-imports/node_modules/pretty-bytes/index.js'
      },
      {
        module: 'chalk',
        path: 'test-replace-imports/node_modules/gulp-imagemin/node_modules/chalk',
        file: 'test-replace-imports/node_modules/gulp-imagemin/node_modules/chalk/source/index.js'
      },
      {
        module: 'imagemin',
        path: 'test-replace-imports/node_modules/imagemin',
        file: 'test-replace-imports/node_modules/imagemin/index.js'
      },
      {
        module: 'plur',
        path: 'test-replace-imports/node_modules/plur',
        file: 'test-replace-imports/node_modules/plur/index.js'
      },
      {
        module: 'gulp-plugin-extras',
        path: 'test-replace-imports/node_modules/gulp-plugin-extras',
        file: 'test-replace-imports/node_modules/gulp-plugin-extras/index.js'
      },
      {
        module: 'imagemin-${pluginName}',
        path: 'test-replace-imports/node_modules/imagemin-gifsicle',
        file: 'test-replace-imports/node_modules/imagemin-gifsicle/index.js'
      },
      {
        module: 'imagemin-${pluginName}',
        path: 'test-replace-imports/node_modules/imagemin-mozjpeg',
        file: 'test-replace-imports/node_modules/imagemin-mozjpeg/index.js'
      },
      {
        module: 'imagemin-${pluginName}',
        path: 'test-replace-imports/node_modules/imagemin-optipng',
        file: 'test-replace-imports/node_modules/imagemin-optipng/index.js'
      },
      {
        module: 'imagemin-${pluginName}',
        path: 'test-replace-imports/node_modules/imagemin-svgo',
        file: 'test-replace-imports/node_modules/imagemin-svgo/index.js'
      }
    ]
    const bufferedContents = file.contents.toString()
    expect(countMatches(bufferedContents, 'import path from \'node:path\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import process from \'node:process\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import prettyBytes from \'pretty-bytes\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import chalk from \'chalk\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import imagemin from \'imagemin\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import plur from \'plur\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import {gulpPlugin} from \'gulp-plugin-extras\'')).toBe(1)
    expect(countMatches(bufferedContents, 'const {default: plugin} = await import(`imagemin-${pluginName}`)')).toBe(1)
    const result = importFiles.reduce(replaceImports(srcPath, destPath), bufferedContents)
    expect(countMatches(result, 'import path from \'node:path\'')).toBe(1)
    expect(countMatches(result, 'import process from \'node:process\'')).toBe(1)
    expect(countMatches(result, 'import prettyBytes from \'../pretty-bytes/index.js\'')).toBe(1)
    expect(countMatches(result, 'import chalk from \'./node_modules/chalk/source/index.js\'')).toBe(1)
    expect(countMatches(result, 'import imagemin from \'../imagemin/index.js\'')).toBe(1)
    expect(countMatches(result, 'import plur from \'../plur/index.js\'')).toBe(1)
    expect(countMatches(result, 'import {gulpPlugin} from \'../gulp-plugin-extras/index.js\'')).toBe(1)
    expect(countMatches(result, 'const {default: plugin} = await import(`../imagemin-${pluginName}/index.js`)')).toBe(1)
  })

  test('will replace imports for nested node modules', () => {
    jest.clearAllMocks()
    const srcPath = 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/index.js'
    const destPath = 'test-replace-imports/external-modules/imagemin-mozjpeg/node_modules/execa'
    const file = {
      base: '/common-exports/test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa',
      contents: Buffer.from(anotherFile),
      cwd: '/common-exports',
      history: [
        '/common-exports/test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/index.js'
      ],
      isVinyl: undefined,
      path: '/common-exports/test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/index.js',
      stat: {}
    }
    const importFiles = [
      {
        module: 'strip-final-newline',
        path: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/strip-final-newline',
        file: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/strip-final-newline/index.js'
      },
      {
        module: 'npm-run-path',
        path: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/npm-run-path',
        file: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/npm-run-path/index.js'
      },
      {
        module: 'onetime',
        path: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/onetime',
        file: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/onetime/index.js'
      },
      {
        module: './lib/error.js',
        path: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/error.js',
        file: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/error.js'
      },
      {
        module: './lib/stdio.js',
        path: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/stdio.js',
        file: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/stdio.js'
      },
      {
        module: './lib/kill.js',
        path: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/kill.js',
        file: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/kill.js'
      },
      {
        module: './lib/stream.js',
        path: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/stream.js',
        file: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/stream.js'
      },
      {
        module: './lib/promise.js',
        path: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/promise.js',
        file: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/promise.js'
      },
      {
        module: './lib/command.js',
        path: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/command.js',
        file: 'test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/command.js'
      }
    ]
    const bufferedContents = file.contents.toString()
    expect(countMatches(bufferedContents, 'import {Buffer} from \'node:buffer\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import path from \'node:path\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import childProcess from \'node:child_process\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import process from \'node:process\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import crossSpawn from \'cross-spawn\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import stripFinalNewline from \'strip-final-newline\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import {npmRunPathEnv} from \'npm-run-path\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import onetime from \'onetime\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import {makeError} from \'./lib/error.js\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import {normalizeStdio, normalizeStdioNode} from \'./lib/stdio.js\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import {spawnedKill, spawnedCancel, setupTimeout, validateTimeout, setExitHandler} from \'./lib/kill.js\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import {handleInput, getSpawnedResult, makeAllStream, validateInputSync} from \'./lib/stream.js\'')).toBe(1)
    expect(countMatches(bufferedContents, 'import {joinCommand, parseCommand, getEscapedCommand} from \'./lib/command.js\'')).toBe(1)

    const result = importFiles.reduce(replaceImports(srcPath, destPath), bufferedContents)
    expect(countMatches(result, 'import {Buffer} from \'node:buffer\'')).toBe(1)
    expect(countMatches(result, 'import path from \'node:path\'')).toBe(1)
    expect(countMatches(result, 'import childProcess from \'node:child_process\'')).toBe(1)
    expect(countMatches(result, 'import process from \'node:process\'')).toBe(1)
    expect(countMatches(result, 'import crossSpawn from \'cross-spawn\'')).toBe(1)
    expect(countMatches(result, 'import stripFinalNewline from \'../strip-final-newline/index.js\'')).toBe(1)
    expect(countMatches(result, 'import {npmRunPathEnv} from \'../npm-run-path/index.js\'')).toBe(1)
    expect(countMatches(result, 'import onetime from \'../onetime/index.js\'')).toBe(1)
    expect(countMatches(result, 'import {makeError} from \'./lib/error.js\'')).toBe(1)
    expect(countMatches(result, 'import {normalizeStdio, normalizeStdioNode} from \'./lib/stdio.js\'')).toBe(1)
    expect(countMatches(result, 'import {spawnedKill, spawnedCancel, setupTimeout, validateTimeout, setExitHandler} from \'./lib/kill.js\'')).toBe(1)
    expect(countMatches(result, 'import {handleInput, getSpawnedResult, makeAllStream, validateInputSync} from \'./lib/stream.js\'')).toBe(1)
    expect(countMatches(result, 'import {joinCommand, parseCommand, getEscapedCommand} from \'./lib/command.js\'')).toBe(1)

    expect(makeCommon).toBeCalledTimes(9)
    expect(makeCommon).toHaveBeenCalledWith('test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/strip-final-newline/index.js', 'test-replace-imports/external-modules/imagemin-mozjpeg/node_modules/strip-final-newline', {})
    expect(makeCommon).toHaveBeenCalledWith('test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/npm-run-path/index.js', 'test-replace-imports/external-modules/imagemin-mozjpeg/node_modules/npm-run-path', {})
    expect(makeCommon).toHaveBeenCalledWith('test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/onetime/index.js', 'test-replace-imports/external-modules/imagemin-mozjpeg/node_modules/onetime', {})
    expect(makeCommon).toHaveBeenCalledWith('test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/error.js', 'test-replace-imports/external-modules/imagemin-mozjpeg/node_modules/execa/lib', {})
    expect(makeCommon).toHaveBeenCalledWith('test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/stdio.js', 'test-replace-imports/external-modules/imagemin-mozjpeg/node_modules/execa/lib', {})
    expect(makeCommon).toHaveBeenCalledWith('test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/kill.js', 'test-replace-imports/external-modules/imagemin-mozjpeg/node_modules/execa/lib', {})
    expect(makeCommon).toHaveBeenCalledWith('test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/stream.js', 'test-replace-imports/external-modules/imagemin-mozjpeg/node_modules/execa/lib', {})
    expect(makeCommon).toHaveBeenCalledWith('test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/promise.js', 'test-replace-imports/external-modules/imagemin-mozjpeg/node_modules/execa/lib', {})
    expect(makeCommon).toHaveBeenCalledWith('test-replace-imports/node_modules/imagemin-mozjpeg/node_modules/execa/lib/command.js', 'test-replace-imports/external-modules/imagemin-mozjpeg/node_modules/execa/lib', {})
  })

  test('will prefix the import with ./ when no relative path used', () => {
    const fileName = './gulpfile.mjs'
    const moduleName = 'gulp-babel'
    const modulePath = 'node_modules/gulp-babel'
    const fileContent = readFileSync(fileName).toString()
    expect(countMatches(fileContent, 'const babel = require(\'gulp-babel\')')).toBe(1)
    const result = replaceImports(fileName, 'vendor')(fileContent, {module: moduleName, path: modulePath, file: `${modulePath}/index.js`})
    expect(countMatches(result, 'const babel = require(\'./node_modules/gulp-babel/index.js\')')).toBe(1)
  })
})
