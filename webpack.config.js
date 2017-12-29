const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.js",
  plugins: [new HtmlWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env", "react"]
          }
        }
      },
      {
        test: /\.rs$/,
        use: [
          {
            loader: "wasm-loader"
          },
          {
            loader: "rust-native-wasm-loader",
            options: {
              gc: true,
              release: true
            }
          }
        ]
      }
    ]
  }
};
