const HtmlWebpackPlugin = require('html-webpack-plugin');
const { MiniCssExtractPlugin } = require('mini-css-extract-plugin');
const { resolve } = require('node:path');

const IS_PROD = process.env.NODE_ENV === 'production' || false;

module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  target: 'web',
  entry: resolve(__dirname, './src/index.js'),
  devtool: IS_PROD ? false : 'source-map',
  stats: 'errors-only',
  resolve: {
    extensions: ['.js', '.mjs', '.cjs']
  },
  output: {
    clean: true,
    path: resolve(__dirname, './dist'),
    filename: '[name].[chunkhash].js',
    publicPath: IS_PROD ? '/compass/' : '/',
    globalObject: 'this'
  },
  devServer: {
    static: resolve(__dirname, './dist'),
    devMiddleware: {
      writeToDisk: true
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /node_module/
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    ...(IS_PROD ? [...new MiniCssExtractPlugin()] : []),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
};
