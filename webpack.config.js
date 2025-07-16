const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const projectEnv = require("./page-builder/bin/packages/env");

console.log("Project Environment:", projectEnv);



module.exports = (env, argv) => {
  const IS_PRODUCTION = argv.mode === "production";
  return {
    entry: {
      admin: "./admin/assets/js/src/index.js",
      frontend: "./frontend/assets/js/index.js",
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name]/assets/css/dist/style.min.css",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(s(a|c)ss)$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: path.resolve(__dirname,"./bin/webpack-conditional-loader.js"),
              options: {
                ...projectEnv,
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: false,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            sourceMap: !IS_PRODUCTION,
          },
          extractComments: false,
        }),
      ],
    },
    output: {
      filename: "[name]/assets/js/dist/index.js",
      path: path.resolve(__dirname, "./"),
    },
    devtool: !IS_PRODUCTION ? "source-map" : false,
    watch: !IS_PRODUCTION,
  };
};
