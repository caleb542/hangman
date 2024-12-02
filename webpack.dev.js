const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common,{
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: path.resolve(__dirname, 'public'),
        hot: true, 
        watchFiles: ['src/*.html', 'src/styles/*.css'], },
        plugins: [ 
            new webpack.HotModuleReplacementPlugin()
        ] 
});