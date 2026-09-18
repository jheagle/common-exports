module.exports = {
  plugins: ['plugins/markdown'],
  source: {
    include: ['dist', 'dist/functions', 'dist/utilities'],
    includePattern: '.+\\.js(doc|x)?$',
    excludePattern: '((^|\\/|\\\\)_|.+\\.(test|min)\\..*)'
  },
}
