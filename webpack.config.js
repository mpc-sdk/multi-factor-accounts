const CopyWebpackPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

module.exports = {
  entry: "./app/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        /* options: see below */
      }),
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  devtool: false,
  mode: process.env.NODE_ENV || "development",
  plugins: [
    new CopyWebpackPlugin({
      patterns: ["index.html", "dist/styles.css", "favicon.png"],
    }),
    new webpack.DefinePlugin({
      "process.env.RELAY_URL": JSON.stringify(process.env.RELAY_URL),
      "process.env.SNAP_ID": JSON.stringify(process.env.SNAP_ID),
    }),
  ],
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    liveReload: false,
  },
  experiments: {
    //syncWebAssembly: true,
    asyncWebAssembly: true,
    //topLevelAwait: true,
  },
};
