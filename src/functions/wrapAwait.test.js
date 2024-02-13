import { countMatches } from 'test-filesystem'
import { wrapAwait } from './wrapAwait'

const noWrapContent = 'const imageminMozjpeg = options => async buffer => {\n' +
  '\tconst {stdout} = await execa(mozjpeg, args, {\n' +
  '\t\tencoding: null,\n' +
  '\t\tinput: buffer,\n' +
  '\t\tmaxBuffer: Number.POSITIVE_INFINITY,\n' +
  '\t});\n' +
  '\n' +
  '\treturn stdout;\n' +
  '};\n' +
  '\n' +
  'export default imageminMozjpeg;'

const wrapContent = 'export default function gulpImagemin(plugins, options) {\n' +
  '}\n' +
  '\n' +
  'export const mozjpeg = await exposePlugin(\'mozjpeg\');'

describe('wrapAwait', () => {
  test('does not wrap if not needed', () => {
    expect(wrapAwait(noWrapContent, 'no-wrap-file')).toEqual(noWrapContent)
  })

  test('applies wrap if await found', () => {
    expect(countMatches(wrapAwait(wrapContent, 'do-wrap-file'), 'async function exportDoWrapFile () {')).toBe(1)
  })
})
