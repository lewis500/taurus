const { resolve } = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var definePlugin = new webpack.DefinePlugin({
  __NODE_ENV__: JSON.stringify("production"),
});

module.exports = {
  context: __dirname,
  entry: {
    main: "./src/index.js"
  },
  output: {
    path: resolve(__dirname, "public"),
    publicPath: "/",
    filename: "[name].js"
  },
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src", "index.html")
    }),
    definePlugin
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: resolve(__dirname, "src"),
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]",
          "sass-loader"
        ]
      }
    ]
  },
  devtool: "source-map",
  resolve: {
    alias: {
      src: resolve(__dirname, "src")
    },
    extensions: [".js", ".json", ".scss"]
  }
};
