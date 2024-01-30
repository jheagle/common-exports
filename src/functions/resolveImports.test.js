import findImports from './findImports'
import isCommonModule from './isCommonModule'
import makeFilepath from './makeFilepath'
import makeModuleInfo from './makeModuleInfo'
import resolveImports from './resolveImports'

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
jest.mock('./makeFilepath', () => jest.fn(() => dirPath))
jest.mock('./findImports', () => jest.fn(() => foundModules))
jest.mock('./makeModuleInfo', () => jest.fn((path, moduleName) => [
  {
    module: moduleName,
    path: '',
    file: '',
  }
]))
jest.mock('./isCommonModule', () => jest.fn((moduleInfo) => moduleInfo.module === 'gulp-plugin-extras'))

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

describe('resolveImports', () => {
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
    // We set one module to be considered common so it is skipped, we get the total found minus one then
    expect(resolvedImports.length).toEqual(foundModules.length - 1)
    expect(makeFilepath).toHaveBeenCalledWith(`/${basePath}/node_modules/gulp-imagemin`)
    expect(findImports).toHaveBeenCalledWith(fileContents)
    expect(makeModuleInfo).toHaveBeenCalledTimes(foundModules.length)
    foundModules.forEach(moduleName => expect(makeModuleInfo).toHaveBeenCalledWith(dirPath, moduleName))
    expect(isCommonModule).toHaveBeenCalledTimes(foundModules.length)
  })
})
