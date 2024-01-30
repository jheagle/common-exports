import * as stream from 'stream'
import { dest, src } from 'gulp'
// @ts-ignore
import babel from 'gulp-babel'
// @ts-ignore
import through, { TransformCallback } from 'through2'
import strAfterLast from '../utilities/strAfterLast'
import resolveImports, { StreamFile } from './resolveImports'
import replaceImports from './replaceImports'
import replaceImportMeta from './replaceImportMeta'
import wrapAwait from './wrapAwait'
import copyResources from './copyResources'

/**
 * Apply babel to source files and output with commonJs compatibility.
 * @param {string|array} srcPath
 * @param {string} destPath
 * @param {Object<string, Object.<string, *>>} [config={}]
 * @return {stream.Stream}
 */
export const makeCommon = (srcPath: string, destPath: string, config: {
  [key: string]: { [key: string]: any }
} = {}): stream.Stream => src(srcPath)
  .pipe(through.obj(function (file: StreamFile, enc: BufferEncoding, callback: TransformCallback): void {
    const fileContents = resolveImports(file)
      .reduce(
        replaceImports(srcPath, destPath, file, config),
        file.contents.toString()
      )
    copyResources(srcPath, config)
    file.contents = Buffer.from(fileContents)
    this.push(file)
    callback()
  }))
  .pipe(babel())
  .pipe(through.obj(function (file: StreamFile, enc: BufferEncoding, callback: TransformCallback): void {
    let fileContents = file.contents.toString()
    fileContents = replaceImportMeta(fileContents)
    const wrappedContents = wrapAwait(fileContents, strAfterLast(file.base, '/'))
    file.contents = Buffer.from(wrappedContents)
    this.push(file)
    callback()
  }))
  .pipe(dest(destPath))

export default makeCommon
