/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');

module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    rules: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      use: [
        'babel-loader'
      ],
      exclude: /node_modules/,
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader?modules'],
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader?modules', 'sass-loader']
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      use: ['file-loader'],
    }, {
      test: /\.(jpg|png|gif)$/,
      use: [
        'file-loader',
        'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
      ],
    }, {
      test: /\.html$/,
      use: ['html-loader'],
    }, {
      test: /\.(mp4|webm)$/,
      use: ['url-loader?limit=10000'],
    }],
  },
  plugins: options.plugins.concat([
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.NamedModulesPlugin(),
  ]),
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      'node_modules'
    ],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ]
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
});
