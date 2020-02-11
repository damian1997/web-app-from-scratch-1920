const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require('./webpack.config');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require ('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')

const parsePath = path.parse(__filename);
module.exports = merge(common,{
    mode: 'production',
    output: {
        filename: '[name]-[contentHash].bundle.js',
        path: parsePath.dir + '/dist'
    },
    module: {
      rules: [
          {
              test: /\.scss$/,
              use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader?sourceMap',
                  'postcss-loader',
                  'sass-loader'
              ]
          },
      ]
    },
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin(),
            new HtmlWebpackPlugin({
                template: parsePath.dir + '/src/index.html',
                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true
                }
            })
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contentHash].css'
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer()
                ]
            }
        })
    ]
});