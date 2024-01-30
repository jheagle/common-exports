import makeRelativePath from './makeRelativePath'

describe('makeRelativePath', () => {
  test('creates correct relative path', () => {
    const relativePath = makeRelativePath(
      'test-relative-path/node_modules/globby/gitignore.js',
      'test-relative-path/node_modules/ignore/index.js'
    )
    expect(relativePath).toEqual('../ignore/index.js')
  })
})
