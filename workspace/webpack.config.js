const webpack = require('webpack');
const path = require('path');

module.exports = (env) => {
  let config = {
    stats: {
      version: false,
      hash: false,
      colors: true,
    },

    watch: env.watch,
    watchOptions: {
      aggregateTimeout: 50,
    },

    target: 'web',
    devtool: (
      env.target === 'dev' ? 'cheap-module-source-map' : // cheap-module-eval-source-map
      env.target === 'prod' ? 'source-map' :
      env.target === 'deploy' ? 'hidden-source-map' :
      null
    ),

    context: path.resolve(__dirname, 'src'),
    entry: './index',

    output: {
      path: path.resolve(__dirname, 'output'),
      filename: 'bundle.js',
      // TODO: this must change for actual packages!
      //devtoolModuleFilenameTemplate: (info) => {
      //  return 'surgical:///' + info.resourcePath;
      //}
      //chunkFilename: '[chunkhash:12].js',
      //hotUpdateChunkFilename: '[hash:12].hot.js',
      //hotUpdateMainFilename: '[hash:12].hot.json'
    },

    module: {
      rules: [{
        parser: {
          amd: false,
          system: false,
          requireJs: false,
        },
      }],
    },

    plugins: [],
  };

  config.plugins.push(
    new webpack.DefinePlugin({
      '__SURGICAL_DEBUG__': JSON.stringify(env.target === 'dev'),
    })
  );

  if (env.target === 'prod') {
    config.plugins.push(
      new webpack.optimize.ModuleConcatenationPlugin()
    );

    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          drop_console: true,
          keep_infinity: true, // Personal preference
        },
      })
    );
  }

  if (!env.nobabel) {
    config.module.rules.push({
      test: /\.js$/,
      exclude: /\/node_modules\//,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            [require('babel-preset-env'), {
              'modules': false,
              //'useBuiltIns': true,
            }],
          ],
          plugins: [
            /*['transform-runtime', {
              'helpers': true,
              'regenerator': false,
              'polyfill': false,
            }],*/
          ],
        },
      },
    });
  }

  return config;
};
