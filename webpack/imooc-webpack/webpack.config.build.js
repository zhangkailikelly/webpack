const htmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
var path = require("path");
module.exports = {
    entry: {
        // main:"./src/js/main.js",
        index: "./src/components/index.jsx",
        vendors: ["react", "react-dom"]
    },
    output: {
        path: "./dist",//设定生成文件的路径
        publicPath: "./",//设定静态资源的访问路径
        filename: "[name]-[chunkhash:5].js"//:5表示5位的哈希值,使用[name]占位符生成多个文件名;[hash]:每次生成不同的hash值,[chunkhash]:每次只有变化的变化的文件的hash值才会变化
    },
    module: {
        loaders: [
            {
                //babel-loader,babel-core,babel-preset-es2015,babel-preset-stage-0
                loader: "babel-loader",
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, "src"),
                exclude: path.resolve(__dirname, "node_modules"),   //排除打包目录
                query: {
                    presets: ["es2015", "react", "stage-0"]
                }
            }
            , {
                loader: "style-loader!css-loader!less-loader",//如果npm为3.x,npm install less npm install less-loader
                exclude: /node_modules/,
                test: /\.(css|less)$/
            }
            , {
                loaders:["url-loader?limit=10240&&name=/imgs/[name]-[hash:5].[ext]","image-webpack-loader"],//image-webpack-loader压缩图片
                exclude: /node_modules/,
                test: /\.(png|jpg|gif|svg)$/i   //  /i不去区分大小写
            }
        ]
    }
    , plugins: [
        new htmlWebpackPlugin({
            filename: "index1.html",//设定文件名
            template: "./index.html",//指定模板
            inject: "body",//指定生成的js文件放置的位置,默认为body,可选head,false(自定义),
            title: "webapck test",
            date: "哈哈",
            // minify:{
            // 	removeComments:true,	//删除注释
            // 	collapseWhitespace:true //删除空格
            // },
            favicon: false,	//将给定的图标路径添加到html输出。
            chunks: ["vendors", "index"]			//允许加载只对你有用的chunks(即生成的js文件)
        })
        // , new htmlWebpackPlugin({
        //     filename: "index2.html",//设定文件名
        //     template: "./index.html",//指定模板
        //     inject: "body",//指定生成的js文件放置的位置,默认为body,可选head,false(自定义),
        //     title: "webapck test",
        //     date: "哈哈",
        //     // minify:{
        //     // 	removeComments:true,	//删除注释
        //     // 	collapseWhitespace:true //删除空格
        //     // },
        //     favicon: false,	//将给定的图标路径添加到html输出。
        //     // excludeChunks:[],	//由于默认加载所有chunks,excludeChunks作用为排除指定的chunks
        //     chunks: ["a"]			//允许加载只对你有用的chunks(即生成的js文件)
        // })
        , new webpack.optimize.CommonsChunkPlugin({
            name: "vendors"
            , filename: "vendors-[chunkhash].js"
        })//抽离公共模块
        ,new webpack.optimize.UglifyJsPlugin({//压缩js
            compress:{
                warnings:false
            }
        })
    ]
}