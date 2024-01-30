import regexEscape from './regexEscape'

describe('regexEscape', () => {
  test('escapes all special characters', () => {
    expect(regexEscape(
      '.*+?^${}()|[]\\'
    )).toEqual('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\')
  })
})
