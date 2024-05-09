import { isCommonModule } from './isCommonModule'
import { makeFilepath } from '../utilities/makeFilepath'
import { makeModuleInfo } from './makeModuleInfo'
import { resolveImports } from './resolveImports'

const basePath = 'test-resolve-imports'
const foundModules = [
  'pretty-bytes',
  'chalk',
  'imagemin',
  'plur',
  'gulp-plugin-extras',
  'imagemin-${pluginName}'
]
const dirPath = 'test-resolve-imports/node_modules/gulp-imagemin'
jest.mock('../utilities/makeFilepath', () => ({ makeFilepath: jest.fn(() => dirPath) }))
jest.mock('./makeModuleInfo', () => ({
  makeModuleInfo: jest.fn((path, moduleName) => [
    {
      module: moduleName,
      path: '',
      file: '',
    }
  ])
}))
jest.mock('./isCommonModule', () => ({ isCommonModule: jest.fn((moduleInfo) => moduleInfo.module === 'gulp-plugin-extras') }))

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

const owContents = 'import is from \'@sindresorhus/is\';\n' +
  'import { ArgumentError } from \'../argument-error.js\';\n' +
  'import { not } from \'../operators/not.js\';\n' +
  'import { generateArgumentErrorMessage } from \'../utils/generate-argument-error-message.js\';\n' +
  'import { testSymbol } from \'./base-predicate.js\';'

const foundOwModules = [
  '@sindresorhus/is',
  '../argument-error.js',
  '../operators/not.js',
  '../utils/generate-argument-error-message.js',
  './base-predicate.js'
]

describe('resolveImports', () => {
  let timesCalled = 0
  test('will take the modules identified and format them', () => {
    const file = {
      base: `/common-exports/${basePath}/node_modules/gulp-imagemin`,
      contents: Buffer.from(fileContents),
      cwd: '/common-exports',
      history: [
        `/common-exports/${basePath}/node_modules/gulp-imagemin/index.js`
      ],
      isVinyl: undefined,
      path: `/common-exports/${basePath}/node_modules/gulp-imagemin/index.js`,
      stat: {}
    }
    const resolvedImports = resolveImports(file)
    // We set one module to be considered common, so it is skipped, we get the total found minus one then
    expect(resolvedImports.length).toEqual(foundModules.length - 1)
    expect(makeFilepath).toHaveBeenCalledWith(`/${basePath}/node_modules/gulp-imagemin`)
    timesCalled += foundModules.length
    expect(makeModuleInfo).toHaveBeenCalledTimes(timesCalled)
    foundModules.forEach(moduleName => expect(makeModuleInfo).toHaveBeenCalledWith(dirPath, moduleName, dirPath))
    expect(isCommonModule).toHaveBeenCalledTimes(timesCalled)
  })

  test('find imports from nested file', () => {
    const file = {
      base: `/common-exports/${basePath}/node_modules/ow`,
      contents: Buffer.from(owContents),
      cwd: '/common-exports',
      history: [
        `/common-exports/${basePath}/node_modules/ow/dist/predicates/predicate.js`
      ],
      isVinyl: undefined,
      path: `/common-exports/${basePath}/node_modules/ow/dist/predicates/predicate.js`,
      stat: {}
    }
    const resolvedImports = resolveImports(file)
    // We set one module to be considered common, so it is skipped, we get the total found minus one then
    expect(resolvedImports.length).toEqual(foundOwModules.length)
    expect(makeFilepath).toHaveBeenCalledWith(`/${basePath}/node_modules/ow`)
    timesCalled += foundOwModules.length
    expect(makeModuleInfo).toHaveBeenCalledTimes(timesCalled)
    foundOwModules.forEach(moduleName => expect(makeModuleInfo).toHaveBeenCalledWith(dirPath, moduleName, dirPath))
    expect(isCommonModule).toHaveBeenCalledTimes(timesCalled)
  })
})
