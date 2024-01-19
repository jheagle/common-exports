import findImports from './findImports'

const multilineImport = 'import ansiStyles from \'#ansi-styles\';\n' +
  'import supportsColor from \'#supports-color\';\n' +
  'import { // eslint-disable-line import/order\n' +
  '\tstringReplaceAll,\n' +
  '\tstringEncaseCRLFWithFirstIndex,\n' +
  '} from \'./utilities.js\';\n' +
  '\n' +
  'const {stdout: stdoutColor, stderr: stderrColor} = supportsColor;\n' +
  '\n' +
  'const GENERATOR = Symbol(\'GENERATOR\');\n' +
  'const STYLER = Symbol(\'STYLER\');\n' +
  'const IS_EMPTY = Symbol(\'IS_EMPTY\');\n' +
  '\n' +
  '// `supportsColor.level` → `ansiStyles.color[name]` mapping\n' +
  'const levelMapping = [\n' +
  '\t\'ansi\',\n' +
  '\t\'ansi\',\n' +
  '\t\'ansi256\',\n' +
  '\t\'ansi16m\',\n' +
  '];'

const exportImports = 'export gifsicle from \'imagemin-gifsicle\';\n' +
  'export mozjpeg from \'imagemin-mozjpeg\';\n' +
  'export optipng from \'imagemin-optipng\';\n' +
  'export svgo from \'imagemin-svgo\';\n'

const importFunction = 'import(\'imagemin-gifsicle\')\n' +
  'import(\'imagemin-mozjpeg\')\n' +
  'import(\'imagemin-optipng\')\n' +
  'import(\'imagemin-svgo\')'

const weirdImport = 'const defaultPlugins = [\'gifsicle\', \'mozjpeg\', \'optipng\', \'svgo\'];\n' +
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
  'const getDefaultPlugins = async () => Promise.all(defaultPlugins.flatMap(plugin => loadPlugin(plugin)));\n' +
  '\n' +
  'export const gifsicle = await exposePlugin(\'gifsicle\');\n' +
  'export const mozjpeg = await exposePlugin(\'mozjpeg\');\n' +
  'export const optipng = await exposePlugin(\'optipng\');\n' +
  'export const svgo = await exposePlugin(\'svgo\');\n'

const someOtherOne = 'import {Buffer} from \'node:buffer\';\n' +
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
  'import {joinCommand, parseCommand, getEscapedCommand} from \'./lib/command.js\';'

const squishedImports = 'import{constants}from"os";\n' +
  '\n' +
  'import{SIGRTMAX}from"./realtime.js";\n' +
  'import{getSignals}from"./signals.js";\n'

describe('findImports', () => {
  test('can detect multiline imports', () => {
    const found = findImports(multilineImport)
    expect(found).toEqual([
      '#ansi-styles',
      '#supports-color',
      './utilities.js'
    ])
  })

  test('can detect exported imports', () => {
    const found = findImports(exportImports)
    expect(found).toEqual([
      'imagemin-gifsicle',
      'imagemin-mozjpeg',
      'imagemin-optipng',
      'imagemin-svgo'
    ])
  })

  test('can detect dynamic imports', () => {
    const found = findImports(importFunction)
    expect(found).toEqual([
      'imagemin-gifsicle',
      'imagemin-mozjpeg',
      'imagemin-optipng',
      'imagemin-svgo'
    ])
  })

  test('can detect even weird imports', () => {
    const found = findImports(weirdImport)
    expect(found).toEqual([
      'imagemin-${pluginName}',
    ])
  })

  test('can detect another bunch of relative paths', () => {
    const found = findImports(someOtherOne)
    expect(found).toEqual([
      'cross-spawn',
      'strip-final-newline',
      'npm-run-path',
      'onetime',
      './lib/error.js',
      './lib/stdio.js',
      './lib/kill.js',
      './lib/stream.js',
      './lib/promise.js',
      './lib/command.js',
    ])
  })

  test('can still detect when people forget spaces exist', () => {
    const found = findImports(squishedImports)
    expect(found).toEqual([
      'os',
      './realtime.js',
      './signals.js',
    ])
  })
})
