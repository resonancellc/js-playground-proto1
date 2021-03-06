const path = require('path');
const devMode = process.env.NODE_ENV === 'development';

const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    mode: devMode ? 'development' : 'production',
    entry: {
        'index': './src/js/index.js',
        'htmlcss': './src/js/htmlcss.js'
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader', // Run post css actions
                        options: {
                            sourceMap: true,
                            plugins: function () { // post css plugins, can be exported to postcss.config.js
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader', // Run post css actions
                        options: {
                            sourceMap: true,
                            plugins: function () { // post css plugins, can be exported to postcss.config.js
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: false }
                    }
                ]
            }
        ]
    },
    plugins: [
        new WebpackCleanupPlugin(),
        new HtmlWebPackPlugin({
            chunks: ['index'],
            template: "./src/index.html",
            filename: "index.html",
            hash: devMode ? false : true
        }),
        new HtmlWebPackPlugin({
            chunks: ['htmlcss'],
            template: "./src/htmlcss.html",
            filename: "htmlcss.html",
            hash: devMode ? false : true
        }),
        new HtmlWebPackPlugin({
            chunks: ['preview'],
            template: "./src/preview.html",
            filename: "preview.html",
            hash: devMode ? false : true
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),
        new WebpackNotifierPlugin({alwaysNotify: true}),
        // BrowserSync will start only when you run Webpack in watch mode
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            open: false,
            server: { baseDir: ['dist'] }
            // OR
            //proxy: '<your-local-host-here>',
        })
    ],
    optimization: {
        minimize: devMode ? false : true,
        minimizer: [
            new TerserPlugin(),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
}