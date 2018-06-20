const path = require('path')
const pkg = require('./package.json')

const webpackModule = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }
  ]
}

module.exports = [
  {
    target: 'node',
    mode: 'production',
    entry: {
      index: path.join(__dirname, '/src/index.node.js')
    },
    devtool: 'inline-source-map',
    output: {
      path: path.join(__dirname, '/dist'),
      libraryTarget: 'commonjs',
      filename: '[name].node.js'
    },
    module: webpackModule
  },
  {
    target: 'node',
    mode: 'production',
    entry: {
      index: path.join(__dirname, '/src/index.js')
    },
    devtool: 'inline-source-map',
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].js'
    },
    module: webpackModule
  }
]
