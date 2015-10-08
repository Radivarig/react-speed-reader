module.exports = {
  entry: "./src/entry.js",
  output: {
    path: "./",
    filename: "bundle.js"
  },
  devtool: "source-map",
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel', 'flowcheck', 'babel?blacklist=flow'], exclude: /node_modules/ }
    , { test: /\.css$/, loaders: ['style-loader', 'css-loader'], exclude: /node_modules/ }
    ]
  }
}
