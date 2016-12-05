var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src',
  plugins: [
    new webpack.ProvidePlugin({riot: 'riot'}),
    new HtmlWebpackPlugin({
      hash: true,
      filename: 'index.html',
      template: './index.template.html'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.tag$/,
        exclude: /node_modules/,
        loader: 'riotjs-loader',
        query: {
          type: 'babel'
        }
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.css$/,
        loader: "style!css"
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ]
  },
  output: {
    path: 'build',
    // path: __dirname + '/build',
    publicPath: '/',
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
