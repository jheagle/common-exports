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
        // Pinned (instead of 'current') so the compiled dist does not depend on the Node version doing the build (Node 24
        // drops the core-js polyfills Node 20 gets). Raise it deliberately.
        targets: { node: '20.6' }
      }
    ]
  ]
}
