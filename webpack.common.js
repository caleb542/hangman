
// import css from '.src/styles/style.css'
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill','src/index.js'],
    output: {
        path: path.resolve(__dirname,'public'),
        filename: 'bundle.js',
        clean: true,
    },
    plugins: [ new HtmlWebpackPlugin({
        title: 'Webpack App',

        template: './src/index.html' 
    }) ],
    module: {
        rules: [
            { 
                test: /\.css$/, 
                use: [
                    'style-loader', 
                    'css-loader'
                ] 
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                }
            }
        ]
    }
};