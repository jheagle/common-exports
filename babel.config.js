module.exports = {
  plugins: [
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-transform-modules-commonjs'
  ],
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: { version: '3.6', proposals: true },
        targets: { node: 'current' }
      }
    ]
  ]
}
