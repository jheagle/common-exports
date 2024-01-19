import makeRelativePath from './makeRelativePath'

describe('makeRelativePath', () => {
  test('stuff', () => {
    const relativePath = makeRelativePath(
      'test-relative-path/node_modules/globby/gitignore.js',
      'test-relative-path/node_modules/ignore/index.js'
    )
    console.log('relative', relativePath)
  })
})