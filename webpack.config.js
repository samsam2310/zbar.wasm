const path = require('path');
const webpack = require('webpack');

const generateConfig = (
  entry,
  outputName,
  includeFrom,
  resolveAlias,
  envNames
) => ({
  node: {
    __dirname: true
  },
  target: 'node',
  watchOptions: {
    ignored: '/node_modules/',
    poll: true
  },
  entry: [entry],
  output: {
    path: path.resolve(__dirname, 'test/build'),
    filename: outputName,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'node_modules')],
    alias: Object.keys(resolveAlias).reduce(function(previous, key) {
      previous[key] = path.resolve(__dirname, resolveAlias[key]);
      return previous;
    }, {})
  },
  devtool: 'source-map',
  plugins: [new webpack.EnvironmentPlugin(envNames)],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, includeFrom),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env'],
            plugins: [
              require('babel-plugin-transform-runtime'),
            ]
          }
        }
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  }
});

module.exports = [
  generateConfig(
    './test/test.js',
    'build.js',
    'test',
    {
      data: './data',
      index: './',
    },
    []
  )
];
