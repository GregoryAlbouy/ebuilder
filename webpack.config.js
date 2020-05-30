const path = require('path')

const VERSION = '0.0.10'
const mode = process.env.NODE_ENV
const outputPath = {
    development: './test',
    production: './dist'
}
const outputFilename = {
    development: `ebuilder.js`,
    production: `ebuilder-${VERSION}.min.js`
}
const devtool = {
    development: 'source-map',
    production: false
}


module.exports = {
    mode: mode,
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
        path: path.resolve(__dirname, outputPath[mode]),
        filename: outputFilename[mode],
        library: 'EBuilder',
        // libraryTarget: 'var',
        // globalObject: 'this'
    },
    devtool: devtool[mode],
    plugins: [],
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        configFile: path.resolve(__dirname, './babel.config.json') 
                    }
                }
            },
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    watchOptions: {
        ignored: /node_modules/
    }
}