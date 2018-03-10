const { resolve } = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: resolve(__dirname),
  entry: {
    main: "./src/index.js"
  },
  output: {
    path: resolve(__dirname, "public"),
    publicPath: "/",
    filename: "[name].js"
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    runtimeChunk: true
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src", "index.html")
    })
  ],
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        include: resolve(__dirname, "src"),
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
  resolve: {
    alias: {
      src: resolve(__dirname, "src")
    },
    extensions: [".js", ".json", ".scss"]
  }
};
