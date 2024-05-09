import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { makeCommon } from './main'
import { setUp } from 'test-filesystem'
import { dest, src } from 'gulp'

const tempDir = 'test-make-common/'
const modulesPath = `${tempDir}node_modules`
const vendorPath = `${tempDir}external-modules`
const srcPath = `${tempDir}src`
const browserPath = `${tempDir}browser`

const mainFileContent = 'import { dependency } from \'test-make-common/src/dependency.mjs\'\n' +
  '\n' +
  '/**\n' +
  ' * Start a new message.\n' +
  ' * @param {string} message\n' +
  ' * @return {string}\n' +
  ' */\n' +
  'export const main = (message = \'\') => {\n' +
  '  const mainMessage = \'Entered main\'\n' +
  '  if (!message) {\n' +
  '    return dependency(mainMessage)\n' +
  '  }\n' +
  '  return message + \' | \' + mainMessage\n' +
  '}\n' +
  '\n' +
  'export default main\n'

const dependencyContent = 'import { main } from \'test-make-common/src/main.mjs\'\n' +
  '\n' +
  '/**\n' +
  ' * Add some text to the incoming message.\n' +
  ' * @param {string} message\n' +
  ' * @return {string}\n' +
  ' */\n' +
  'export const dependency = (message = \'\') => {\n' +
  '  const depMessage = \'Entered dependency\'\n' +
  '  return main(message ? `${message} | ${depMessage}` : depMessage)\n' +
  '}\n' +
  '\n' +
  'export default dependency\n'

setUp.setDefaults(tempDir)

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

/**
 * Run the imagemin process to demonstrate that it has been converted successfully.
 * @param {Array} files
 * @param {Function} done
 * @return {stream.Stream}
 */
const imageminTest = (files, done) => {
  const imagemin = require(`../${vendorPath}/gulp-imagemin`).default
  let waiting = files.length
  for (const img of files) {
    const imagesFile = img.testPath
    cpSync(img.origin, img.testPath)
    --waiting
    src(imagesFile)
      .pipe(
        imagemin(
          {
            interlaced: true,
            silent: true,
            verbose: false,
          }
        )
      )
      .pipe(dest(browserPath))
      .on('finish', () => {
        expect(existsSync(browserPath)).toBeTruthy()
        expect(
          readFileSync(img.newPath).toString()
        ).toEqual(
          readFileSync(img.compressed).toString()
        )
        if (waiting <= 0) {
          done()
        }
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  }
}

describe('makeCommon', () => {
  test('can convert files with circular imports', done => {
    expect.assertions(2)
    const srcFile = `${srcPath}/main.mjs`
    writeFileSync(srcFile, mainFileContent)
    writeFileSync(`${srcPath}/dependency.mjs`, dependencyContent)
    makeCommon(srcFile, browserPath)
      .on('finish', () => {
        expect(existsSync(`${browserPath}/main.js`)).toBeTruthy()
        expect(existsSync(`${browserPath}/dependency.js`)).toBeTruthy()
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  })

  describe('can use compiled package', () => {
    const testFileConversions = [
      {
        type: 'gif',
        files: [{
          origin: 'test-assets/original-gif.gif',
          testPath: `${srcPath}/imageToCopy.gif`,
          newPath: `${browserPath}/imageToCopy.gif`,
          compressed: 'test-assets/compressed-gif.gif',
        }]
      },
      {
        type: 'jpg',
        files: [{
          origin: 'test-assets/original-jpg.jpg',
          testPath: `${srcPath}/imageToCopy.jpg`,
          newPath: `${browserPath}/imageToCopy.jpg`,
          compressed: 'test-assets/compressed-jpg.jpg',
        }]
      },
      {
        type: 'png',
        files: [{
          origin: 'test-assets/original-png.png',
          testPath: `${srcPath}/imageToCopy.png`,
          newPath: `${browserPath}/imageToCopy.png`,
          compressed: 'test-assets/compressed-png.png',
        }]
      },
      {
        type: 'svg',
        files: [{
          origin: 'test-assets/original-svg.svg',
          testPath: `${srcPath}/imageToCopy.svg`,
          newPath: `${browserPath}/imageToCopy.svg`,
          compressed: 'test-assets/compressed-svg.svg',
        }]
      },
    ]

    test.each(testFileConversions)(
      `to compress $type images`,
      ({ type, files }, done) => {
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
          'merge2',
          'fast-glob',
          'p-pipe',
          'junk',
          'ignore',
          'slash',
          'imagemin-gifsicle',
          'imagemin-mozjpeg',
          'imagemin-optipng',
          'imagemin-svgo',
          'is-jpg',
          'mozjpeg',
          // 'ow',
          // 'peek-readable',
          // 'strtok3',
        ]
        copyModules.forEach(module => cpSync(`./node_modules/${module}`, `${modulesPath}/${module}`, { recursive: true }))
        expect.assertions(3)
        const srcFile = `${newPath}/index.js`
        makeCommon(srcFile, `${vendorPath}/gulp-imagemin`, {
          copyResources: {
            [`${modulesPath}/mozjpeg/index.js`]: [
              {
                src: `${modulesPath}/mozjpeg/package.json`,
                dest: `${vendorPath}/mozjpeg/package.json`,
                updateContent: (content) => content.replace(
                  '\n\t"type": "module",', ''
                )
              },
              {
                src: `${modulesPath}/mozjpeg/vendor`,
                dest: `${vendorPath}/mozjpeg/vendor`
              }
            ]
          },
          customChanges: {
            [`${modulesPath}/imagemin-mozjpeg/node_modules/execa/lib/kill.js`]: [
              {
                updateContent: (content) => content.replace(
                  'import onExit from \'signal-exit\';',
                  'import { onExit } from \'signal-exit\';'
                )
              }
            ],
            [`${srcFile}`]: [
              {
                updateContent: content => content.replace(
                  'export const gifsicle = await exposePlugin(\'gifsicle\');\n' +
                  'export const mozjpeg = await exposePlugin(\'mozjpeg\');\n' +
                  'export const optipng = await exposePlugin(\'optipng\');\n' +
                  'export const svgo = await exposePlugin(\'svgo\');',
                  'export const gifsicle = exposePlugin(\'gifsicle\');\n' +
                  'export const mozjpeg = exposePlugin(\'mozjpeg\');\n' +
                  'export const optipng = exposePlugin(\'optipng\');\n' +
                  'export const svgo = exposePlugin(\'svgo\');'
                )
              },
            ]
          }
        })
          .on('finish', () => {
            expect(existsSync(vendorPath)).toBeTruthy()
            setTimeout(
              imageminTest,
              800,
              files,
              done
            )
          })
          .on('error', error => {
            console.error('Encountered error', error)
            done()
          })
      },
      8000
    )
  })
})
