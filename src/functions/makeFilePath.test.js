import makeFilepath from './makeFilepath'

describe('makeFilePath', () => {
  test('will use root only and strip last slash', () => {
    expect(makeFilepath('test-path/')).toEqual('test-path')
  })

  test('will use root only with slash and return empty string', () => {
    expect(makeFilepath('/')).toEqual('')
  })

  test('will append but ignore if only a slash', () => {
    expect(makeFilepath('test-path/', '/')).toEqual('test-path')
  })

  test('will append with correct number of slashes', () => {
    expect(makeFilepath('/', '/someFile.js')).toEqual('someFile.js')
  })

  test('will append with extra slashes removed', () => {
    expect(makeFilepath('test-path/', '/some-module/')).toEqual('test-path/some-module')
  })

  test('will append with removed relative dot', () => {
    expect(makeFilepath('test-path/', './some-module/')).toEqual('test-path/some-module')
  })

  test('will go up a directory with relative two dots', () => {
    expect(makeFilepath('test-path/', '../some-module/')).toEqual('some-module')
  })

  test('will go up a directory when already root', () => {
    expect(makeFilepath('/', '../some-module/')).toEqual('../some-module')
  })

  test('will go up several directories', () => {
    expect(makeFilepath('test-path/another/again/deeper', '../../../some-module/')).toEqual('test-path/some-module')
  })

  test('will remove dot slash from root', () => {
    expect(makeFilepath('./')).toEqual('')
  })

  test('will remove dot slash from appended path', () => {
    expect(makeFilepath('test-make-common/node_modules/globby/', './to-path.js')).toEqual('test-make-common/node_modules/globby/to-path.js')
  })
})