const merge = require("webpack-merge");
const common = require("./webpack.common");
const { DefinePlugin } = require('webpack');

module.exports = merge(common, {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: "/node_modules/",
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                            cacheDirectory: true
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: { chunks: "all" }
    },
    plugins: [
        new DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
            }
        }),
    ],
})