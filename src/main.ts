/**
 * Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module common-exports
 */

import * as stream from 'stream'
import { cpSync, readFileSync, writeFileSync } from 'fs'
// @ts-ignore
import babel from 'gulp-babel'
import { copyResources } from './functions/copyResources'
// @ts-ignore
import pkg from 'gulp'
import { replaceImports } from './functions/replaceImports'
import { replaceImportMeta } from './functions/replaceImportMeta'
import { resolveImports, StreamFile } from './functions/resolveImports'
// @ts-ignore
import through, { TransformCallback } from 'through2'
import { customChanges } from './functions/customChanges'
import { hasEsmSyntax } from './functions/hasEsmSyntax'
import { strAfterLast } from './utilities/strAfterLast'
import { strBeforeLast } from './utilities/strBeforeLast'
import { makeFilepath } from './utilities/makeFilepath'
import { stripEsmType } from './functions/stripEsmType'

const { dest, src } = pkg

export type updateContentCallback = (content: string) => string

export type makeCommonConfig = {
  copyResources?: {
    [key: string]: [{ src: string, dest: string, updateContent?: updateContentCallback }]
  },
  customChanges?: {
    [key: string]: [{ updateContent?: updateContentCallback }]
  },
  rootPath?: string,
}

/**
 * Apply babel to source files and output with commonJs compatibility.
 *
 * Two things happen automatically, beyond converting srcPath's own ESM syntax: if srcPath itself is already
 * plain CommonJS (nothing for the conversion pipeline to find/rewrite), its whole containing directory - private
 * dependencies included - is copied wholesale instead of silently producing an incomplete result; and once the
 * whole output tree is otherwise finished, any package.json left declaring `"type": "module"` next to
 * already-CommonJS content (which can happen when an already-common package's own wholesale copy carries along
 * an ESM sibling's original package.json - see replaceImports.ts) has that field stripped, since the output is
 * always meant to be CommonJS.
 * @memberof module:common-exports
 * @param {string|array} srcPath - The relative path to the file to convert.
 * @param {string} destPath - The relative path to the output directory.
 * @param {Object<string, *>} [config={}] - Add additional instructions to the process.
 * @param {Object<string, Array.<Object.<src|dest|updateContent, string|Function>>>} [config.copyResources={}] -
 * Add custom files to copy for found modules.
 * @param {Object<string, Array.<Object.<updateContent, Function>>>} [config.customChanges={}] -
 * Add custom content changes to the content used.
 * @param {string} [config.rootPath=''] - Specify the root to use, this helps identify where to stop.
 * @param {Map<string, Promise<void>>} [inProgress=new Map()] - Tracks recursive conversions already started (by
 * destination path) for this whole call tree, shared across every recursive makeCommon call it spawns. Without
 * this, the same dependency reachable from multiple import chains (a very common shape once a tree gets deep or
 * wide) gets independently, redundantly re-converted - each duplicate spawning its own full sub-tree of further
 * duplicates - which is what caused this function's historical OOM crash under real-world dependency graphs.
 * @param {Set<string>} [ancestors=new Set()] - The chain of source files currently being converted above this
 * call, in this same branch of the recursion. Real packages do have genuine circular imports (e.g. two files that
 * import from each other) - CommonJS/Node handle that fine at runtime via partial exports, but this function
 * cannot: waiting for a circular dependency's own conversion to finish before considering the current file done
 * would deadlock (each side waiting on the other) forever. When a discovered import's target is already an
 * ancestor, its conversion is already in flight further up this same chain - don't wait on it here too. An empty
 * set (the default) also marks this as the outermost call - see below.
 * @returns {stream.Stream}
 */
export const makeCommon = (srcPath: string, destPath: string, config: makeCommonConfig = {}, inProgress: Map<string, Promise<void>> = new Map(), ancestors: Set<string> = new Set()): stream.Stream => {
  const isOutermostCall = ancestors.size === 0
  const finalStream = src(srcPath)
    .pipe(through.obj(function (file: StreamFile, enc: BufferEncoding, callback: TransformCallback): void {
      // If this is the entry point srcPath was originally called with (not a recursively-discovered import) and
      // it has no ESM syntax at all, there's nothing here for the conversion pipeline to find and rewrite -
      // which means its own privately-nested dependencies (require() calls reaching into its own node_modules)
      // would never get individually discovered/copied either, silently relying on whatever the real
      // environment happens to have installed instead of a private, self-contained copy. Copy the whole
      // containing directory wholesale instead, exactly like an already-common *sibling* dependency already
      // gets handled in replaceImports.ts - this package needs no conversion, just relocation with its
      // dependency tree intact.
      if (isOutermostCall && !hasEsmSyntax(file.contents.toString())) {
        try {
          cpSync(strBeforeLast(srcPath, '/'), destPath, { recursive: true })
          copyResources(srcPath, config)
          if (config.customChanges && config.customChanges[srcPath]) {
            const entryDest = makeFilepath(destPath, strAfterLast(srcPath, '/'))
            writeFileSync(entryDest, customChanges(srcPath, readFileSync(entryDest).toString(), config))
          }
          callback()
        } catch (error) {
          callback(error as Error)
        }
        return
      }
      const rootPath = typeof config.rootPath === 'undefined' ? srcPath : config.rootPath
      const pending: Array<Promise<void>> = []
      const currentAncestors = new Set(ancestors)
      currentAncestors.add(srcPath)
      // @ts-ignore
      const fileContents = resolveImports(file, rootPath)
        .reduce(
          replaceImports(srcPath, destPath, config, pending, inProgress, currentAncestors),
          file.contents.toString()
        )
      // makeCommon's own recursive calls (for each discovered import) don't block - wait for them here so this
      // file isn't reported "finished" before its dependencies, arbitrarily deep, have actually been written.
      Promise.all(pending).then(
        () => {
          copyResources(srcPath, config)
          file.contents = Buffer.from(customChanges(srcPath, fileContents, config))
          this.push(file)
          callback()
        },
        (error: Error) => callback(error)
      )
    }))
    .pipe(babel())
    .pipe(through.obj(function (file: StreamFile, enc: BufferEncoding, callback: TransformCallback): void {
      file.contents = Buffer.from(replaceImportMeta(file.contents.toString()))
      this.push(file)
      callback()
    }))
    .pipe(dest(destPath))
  if (isOutermostCall) {
    // Only the outermost call sweeps the output for stray "type": "module" package.json files (see
    // stripEsmType.ts) - it needs the whole tree to actually be finished, not just this one file, and running it
    // once here rather than after every recursive call keeps it cheap.
    finalStream.on('finish', () => stripEsmType(destPath))
  }
  return finalStream
}

if (this) {
  // @ts-ignore
  this.commonExports = makeCommon
} else if (typeof window !== 'undefined') {
  // @ts-ignore
  window.commonExports = makeCommon
}
