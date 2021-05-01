const path = require('path')

const webpackModule = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }
  ]
}

function build(target, type, filename) {
  return {
    target,
    mode: 'production',
    entry: {
      index: path.join(__dirname, '/src/index.js')
    },
    devtool: 'inline-source-map',
    output: {
      path: path.join(__dirname, '/dist'),
      library: {
        type
      },
      filename
    },
    module: webpackModule
  }
}

module.exports = [
  build('node', 'commonjs', 'index.js'),
  build('node', 'commonjs', 'index.node.js'),
  build('web', 'umd', 'index.umd.js')
]
