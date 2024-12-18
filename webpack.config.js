
// import css from '.src/styles/style.css'
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill','./src/index.js'],
    output: {
        path: path.resolve(__dirname,'public'),
        filename: 'bundle.js',
        clean: true,
    },
    
    plugins: [ 

        new HtmlWebpackPlugin({
            title: 'Hangman App',
            filename: 'index.html',
            template: 'src/index.html' 
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
    },
    devServer: {
        static: path.resolve(__dirname, 'public'),
        hot: true, 
        watchFiles: ['src/*.html', 'src/*.css'],
    },
    devtool: 'source-map'
}
    


