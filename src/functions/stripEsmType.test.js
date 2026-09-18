import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { setUp } from 'test-filesystem'
import { stripEsmType } from './stripEsmType'

const tempDir = 'test-strip-esm-type/'

setUp.setDefaults(tempDir)

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('stripEsmType', () => {
  test('strips "type": "module" (tab-indented, with trailing comma)', () => {
    const packageDir = `${tempDir}node_modules/execa`
    mkdirSync(packageDir, { recursive: true })
    writeFileSync(
      `${packageDir}/package.json`,
      '{\n\t"name": "execa",\n\t"type": "module",\n\t"version": "1.0.0"\n}\n'
    )
    stripEsmType(tempDir)
    const content = readFileSync(`${packageDir}/package.json`).toString()
    expect(content).not.toContain('"type"')
    expect(content).toContain('"name": "execa"')
    expect(content).toContain('"version": "1.0.0"')
  })

  test('strips "type": "module" (space-indented, no trailing comma, last property)', () => {
    const packageDir = `${tempDir}node_modules/human-signals`
    mkdirSync(packageDir, { recursive: true })
    writeFileSync(
      `${packageDir}/package.json`,
      '{\n  "name": "human-signals",\n  "type": "module"\n}\n'
    )
    stripEsmType(tempDir)
    const content = readFileSync(`${packageDir}/package.json`).toString()
    expect(content).not.toContain('"type"')
    expect(content).toContain('"name": "human-signals"')
  })

  test('leaves an already-correct package.json untouched', () => {
    const packageDir = `${tempDir}node_modules/cross-spawn`
    mkdirSync(packageDir, { recursive: true })
    const original = '{\n\t"name": "cross-spawn",\n\t"version": "1.0.0"\n}\n'
    writeFileSync(`${packageDir}/package.json`, original)
    stripEsmType(tempDir)
    expect(readFileSync(`${packageDir}/package.json`).toString()).toEqual(original)
  })

  test('recurses through nested directories', () => {
    const deepDir = `${tempDir}node_modules/imagemin-mozjpeg/node_modules/execa/lib`
    mkdirSync(deepDir, { recursive: true })
    writeFileSync(
      `${tempDir}node_modules/imagemin-mozjpeg/node_modules/execa/package.json`,
      '{\n\t"name": "execa",\n\t"type": "module"\n}\n'
    )
    stripEsmType(tempDir)
    const content = readFileSync(`${tempDir}node_modules/imagemin-mozjpeg/node_modules/execa/package.json`).toString()
    expect(content).not.toContain('"type"')
  })
})
