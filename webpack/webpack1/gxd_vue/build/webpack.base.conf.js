var path = require('path')

module.exports = {
  entry: {  // 页面入口文件配置
    app: './src/app.js'
  },
  output: {  // 入口文件输出位置
    path: path.resolve(__dirname, '../dist/static'),
    publicPath: './static/',
    filename: '[name].js'
  },
  externals: {
    'zepto': 'Zepto',
    'wx': 'jWeixin'
  },
  resolve: {
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['', '.js', '.vue', '.less'],
    alias: {
      'src': path.resolve(__dirname, '../src') //后续直接 require('src') 即可
    }
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    // 加载器配置
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel!eslint',
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\/|assets\//
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.less$/,
        loader: 'css!less'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(eot|woff|ttf|svg)$/,
        loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
      }
    ]
  },
  vue: {
    loaders: {
      js: 'babel!eslint',
      less: 'vue-style!css!less',
      sass: 'vue-style!css!sass'
    }
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  }
}
