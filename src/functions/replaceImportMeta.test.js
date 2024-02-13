import { countMatches } from 'test-filesystem'
import { replaceImportMeta } from './replaceImportMeta'

const sampleContent = 'import fs from \'node:fs\';\n' +
  'import process from \'node:process\';\n' +
  'import {fileURLToPath} from \'node:url\';\n' +
  'import BinWrapper from \'bin-wrapper\';\n' +
  '\n' +
  'const pkg = JSON.parse(fs.readFileSync(new URL(\'../package.json\', import.meta.url)));\n' +
  'const url = `https://raw.githubusercontent.com/imagemin/mozjpeg-bin/v${pkg.version}/vendor/`;\n' +
  '\n' +
  'const binWrapper = new BinWrapper()\n' +
  '\t.src(`${url}macos/cjpeg`, \'darwin\')\n' +
  '\t.src(`${url}linux/cjpeg`, \'linux\')\n' +
  '\t.src(`${url}win/cjpeg.exe`, \'win32\')\n' +
  '\t.dest(fileURLToPath(new URL(\'../vendor\', import.meta.url)))\n' +
  '\t.use(process.platform === \'win32\' ? \'cjpeg.exe\' : \'cjpeg\');\n' +
  '\n' +
  'export default binWrapper;\n'

describe('replaceImportMeta', () => {
  test('finds and replaces import.meta usages', () => {
    const replacedContent = replaceImportMeta(sampleContent)
    expect(countMatches(replacedContent, 'require(\'url\').pathToFileURL(__filename).toString()')).toBe(2)
  })
})
