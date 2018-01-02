const webpack = require('webpack')
const path = require('path')
const pkg = require('./package.json')
// const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');

module.exports = {
  entry: {
    index: path.join(__dirname, '/src/index.js')
  },
  output: {
    path: path.join(__dirname, '/dist'),
    library: pkg.name,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    filename: '[name].js'
  },
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: []
}
