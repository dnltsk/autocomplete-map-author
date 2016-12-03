var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src',
  devtool: 'cheap-source-map',
  plugins: [
    new webpack.ProvidePlugin({riot: 'riot'}),
    new HtmlWebpackPlugin({
      template: './index.template.html'
    })
  ],
  module: {
    preLoaders: [
      {
        test: /\.tag$/,
        exclude: /node_modules/,
        loader: 'riotjs-loader',
        query: {
          type: 'babel'
        }
      }
    ],
    loaders: [
      {
        test: /\.js|\.tag$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname + '/build'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: [
      '',
      '.js',
      '.tag'
    ]
  }
};
