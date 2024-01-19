import commonExports from './main'

describe('common-exports', () => {
  test('is object with all helper exports', () =>
    expect(Object.keys(commonExports).length).toBe(1)
  )
})