const path = require('path')

module.exports = {

    entry: {
        'main': './src/dev.tsx'
    },

    output: {
        filename: "[name].js",
        path: __dirname + "/dev",
        publicPath: '/'
    },

    mode: "development",

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [ ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".css" ]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                test: /\.svg$/,
                loader: 'file-loader'
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    /* externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },*/

    devServer: {
        contentBase: [ './src', './node_modules' ],
        publicPath: '/',
        compress: true,
        port: 3000,
        historyApiFallback: {
            index: '/',
            disableDotRule: true
        },
        watchOptions: {
            ignored: [
                    path.resolve(__dirname, 'node_modules')
                ]
        }
      }
};
