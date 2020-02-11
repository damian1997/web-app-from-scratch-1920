const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer')
const path = require('path');

const parsePath = path.parse(__filename);
module.exports = {
    devtool: 'eval',
    entry: {
        main: './src/index.js',
        vendor: './src/vendor.js'
    },
    module: {
        rules: [
            {
                test: /\.(svg|png|jpg|gif|jpeg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash].[ext]',
                        outputPath: 'images'
                    }
                }
            },
            {
                test: /\.html$/,
                use: [ 'html-loader' ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    }
}