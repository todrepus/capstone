const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require("copy-webpack-plugin");
const nodeExternals = require('webpack-node-externals');

/*
entry : 모듈 진입점
index.js <-  (a.js, b.js, c.js) 인 경우, index.js만 추가하면, a.js, b.js, c.js의 변경에 대해서도 반응함.

새로운 웹페이지를 등록하려면,
plugins = [...., new CopyWebpackPlugin([{from:"", to:""}])] 로 등록하면됨.
*/


let SHAMPOO_EXPLAIN = [[],[],[],[],[],[]];
let SHAMPOO_IMAGES  = [[],[],[],[],[],[]];
let DISEASE_EXPLAIN = [0,0,0,0,0,0];
for (let i=1; i<=6 ;i++){
  let rootDIR = `src/shampoo/${i}`;
  fs.readdir(rootDIR, function(error, filelist){
    filelist.forEach(file => {
      const ext = (file.substr(file.lastIndexOf('.')+1)).toLowerCase();
      if (ext == 'txt'){
        const text = fs.readFileSync(`${rootDIR}/${file}`);
        SHAMPOO_EXPLAIN[i-1].push(`'${text}'`);
      }else{
        SHAMPOO_IMAGES[i-1].push(`'${file}'`);
      }
    });
  });
}

for (let i=1; i<=6 ;i++){
  let rootDIR = `src/disease/${i}`;
  if (fs.existsSync(`${rootDIR}/설명1.txt`)){
    const text = fs.readFileSync(`${rootDIR}/설명1.txt`);
    DISEASE_EXPLAIN[i-1] = `'${text}'`;
  }
}

module.exports = {
  entry: {
    "model" : "./src/my/js/model.js",
    "viewResult" : "./src/my/js/viewResult.js",
    "entry" : "./src/my/js/entry.js"
  },
  mode: 'development',
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist'),
    publicPath : "http://localhost:3000/dist/"   
  },
  module: {
    rules: [
      {
        test: /\.js$/, //.js 파일 templating
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [   
    new webpack.DefinePlugin({
      SHAMPOO_EXPLAIN : SHAMPOO_EXPLAIN,
      SHAMPOO_IMAGES  : SHAMPOO_IMAGES,
      DISEASE_EXPLAIN : DISEASE_EXPLAIN
    }),
    new CopyWebpackPlugin([{ from: "./src"}]),
   
  ],
}