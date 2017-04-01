var webpack = require('webpack')
var config = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

config.output.filename = '[name].js'
config.output.chunkFilename = '[id].js'

var SOURCE_MAP = true

config.devtool = SOURCE_MAP ? 'eval-source-map' : false

// add hot-reload related code to entry chunk
config.entry.app = [
  'eventsource-polyfill',
  'webpack-hot-middleware/client?quiet=true&reload=true',
  config.entry.app
]

// generate loader string to be used with extract text plugin
function generateExtractLoaders (loaders) {
  return loaders.map(function (loader) {
    return loader + '-loader' + (SOURCE_MAP ? '?sourceMap' : '')
  }).join('!')
}

config.vue.loaders = {
  js: 'babel!eslint',
  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
  css: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css'])),
  less: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'less'])),
  sass: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'sass'])),
  stylus: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'stylus']))
}

config.output.publicPath = '/'

var proxyMiddleware = require('http-proxy-middleware')

var apiServer = 'http://127.0.0.1:4000'
// var apiServer = 'http://192.168.12.210:80'
var apiServer = 'http://iflytek.lezhiyun.cn'
var lexueserver = 'http://iflytek.lezhiyun.cn'

// var apiServer = 'http://10.4.43.97:8082'

// 吴霞
// var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEMzY5OTdENThCMDg0Q0E5QjM1N0FDMzdDNzhBNzZGRSIsImlhdCI6MTQ4MTYwODMyNCwiZXhwIjoxNDgyMjEzMTI0fQ.ltzC4xGIHVl6jZOIHllQgs4RbHid402WTb7apnjqF0U'

var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0YTNjNmEyMTNiMWQ0OTExOWQyNWZhMzQ3OGIyOGYwZCIsImlhdCI6MTQ4MjcyMTQ5MCwiZXhwIjoxNDgzMzI2MjkwfQ.VUbBLVmIsMnVvXCCWWbZH6JdyBSyGNeMbZcVpC8tlPo'
// var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NzM3NDQ1MzgsImlzcyI6IjE3MTk0YjBkMjY0OTQ3NTZiODUzYTFlYWY0YjNlMWUxIn0.Lkk4K3lmp8x-E4H9rnv7dByJiGRLu7giD4xtTt2MqIw'
var apiProxy = proxyMiddleware('/jssq/api', {
  // pathRewrite: {'jssq/api' : '/'},
  target: apiServer,
  changeOrigin: true,
  headers: {
    Authorization: 'Bearer ' + token
  }
})
var apiProxy1 = proxyMiddleware('/cloudlexueserver', {
  target: lexueserver,
  changeOrigin: true,
  headers: {
    Authorization: 'Bearer ' + token
  }
})

console.log('??????什么鬼啊')
config.plugins = (config.plugins || []).concat([
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new ExtractTextPlugin('[name].css'),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index.html'
  }),
  new BrowserSyncPlugin(
    {
      host: '127.0.0.1',
      port: 8080,
      proxy: 'http://127.0.0.1:8000/',
      notify: false,
      middleware: [apiProxy1,apiProxy]
    },
    {
      reload: true
    }
  )
])

module.exports = config
