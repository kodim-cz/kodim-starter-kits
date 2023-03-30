const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'eval-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
    clean: true,
    assetModuleFilename: 'img/[name]-[hash:6].[ext]',
  },
  devServer: {
    historyApiFallback: true,
    liveReload: false,
    hot: false,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: 'asset/resource'
      }
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '', noErrorOnMissing: true },
      ],
    }),
  ],
};
