const { resolve, join } = require('path');
const slsw = require('serverless-webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const packageJson = require('./package.json');
const componentName = packageJson.componentNmae;
let clientManifest = !slsw.lib.webpack.isLocal ? require('./dist/manifest.json') : {
  "main.css": "/css/main.css",
  "main-ssr.js": "/js/main-ssr.js"
};

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: 'production',
  optimization: {
    splitChunks: false
  },
  performance: {
    hints: false
  },
  devtool: 'nosources-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: false,
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  "autoprefixer"
                ]
              }
            },
          },
          {
            loader: 'sass-loader'
          },
          {
            loader: 'webpack-import-glob-loader',
          },
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      CLIENT_MANIFEST: JSON.stringify(clientManifest),
      'process.env.COMPONENT_NAME': JSON.stringify(componentName)
    })
  ],
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      "@": resolve(__dirname, './src'),
    }
  },
  output: {
    libraryTarget: 'commonjs2',
    path: join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  }
};
