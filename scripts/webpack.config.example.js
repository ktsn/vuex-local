const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, '../example/main.js'),
  output: {
    path: path.resolve(__dirname, '../example'),
    filename: '__build__.js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.vue']
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'buble' },
      { test: /\.vue$/, loader: 'vue' }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../example')
  }
}
