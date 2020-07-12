const merge = require("webpack-merge");
const common = require("./webpack.common");
const { DefinePlugin } = require('webpack');

module.exports = merge(common, {
    mode: "development",
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
    },
    plugins: [
        new DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
            }
        }),
    ]
    })