const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin  = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: {
        'app': "./src/scripts/app.js",
        'detail': "./src/scripts/view/main-detail.js",
        'team': "./src/scripts/view/team-detail.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
              { from: 'prod-manifest.json', to: 'manifest.json' },
              { from: './src/assets/icons', to: 'src/assets/icons'},
              { from: './src/assets/splash', to: 'src/assets/splash'},
            ]
          }),
        new HtmlWebpackPlugin({
            chunks: ['app'],
            template: "./index.html",
            filename: "index.html"
        }),
        new HtmlWebpackPlugin({
            chunks: ['detail'],
            template: "./src/pages/competition-detail.html",
            filename: "competition-detail.html"
        }),
        new HtmlWebpackPlugin({
            chunks: ['team'],
            template: "./src/pages/team-detail.html",
            filename: "team-detail.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/pages/home.html",
            filename: "src/pages/home.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/pages/detail.html",
            filename: "src/pages/detail.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/pages/team.html",
            filename: "src/pages/team.html"
        })
    ],
    devtool: 'inline-source-map'
}