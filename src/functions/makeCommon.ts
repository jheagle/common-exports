import * as stream from 'stream'
import { dest, src } from 'gulp'
// @ts-ignore
import babel from 'gulp-babel'
// @ts-ignore
import through, { TransformCallback } from 'through2'
import strAfterLast from './strAfterLast'
import kabobToTitleCase from './kabobToTitleCase'
import resolveImports, { StreamFile } from './resolveImports'
import replaceImports from './replaceImports'
import { logObject } from 'test-filesystem'
import replaceImportMeta from './replaceImportMeta'

/**
 * Apply babel to source files and output with commonJs compatibility.
 * @param {string|array} srcPath
 * @param {string} destPath
 * @return {stream.Stream}
 */
export const makeCommon = (srcPath: string, destPath: string): stream.Stream => src(srcPath)
  .pipe(through.obj(function (file: StreamFile, enc: BufferEncoding, callback: TransformCallback): void {
    const importFiles = resolveImports(file)
    logObject(importFiles, 'importFiles')
    const fileContents = importFiles.reduce(
      replaceImports(srcPath, destPath, file),
      file.contents.toString()
    )
    file.contents = Buffer.from(fileContents)
    this.push(file)
    callback()
  }))
  .pipe(babel())
  .pipe(through.obj(function (file: StreamFile, enc: BufferEncoding, callback: TransformCallback): void {
    const fileName = strAfterLast(file.base, '/')
    let fileContents = file.contents.toString()
    fileContents = replaceImportMeta(fileContents)
    const exportModuleName = `export${kabobToTitleCase(fileName)}`
    // Wrap the contents in an async function so that any await used will be valid
    const wrappedContents = `async function ${exportModuleName} () {
  ${fileContents}
}

${exportModuleName}()`
    file.contents = Buffer.from(wrappedContents)
    this.push(file)
    callback()
  }))
  .pipe(dest(destPath))

export default makeCommon
