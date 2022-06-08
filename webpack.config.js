const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require("copy-webpack-plugin");



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
    filename: "my/js/[name].js",
    path: path.resolve(__dirname, 'dist')   
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [   
    new webpack.ProvidePlugin({
      $ : "jquery",
      jQuery : "jquery"
    }),
    new webpack.DefinePlugin({
      SHAMPOO_EXPLAIN : SHAMPOO_EXPLAIN,
      SHAMPOO_IMAGES  : SHAMPOO_IMAGES,
      DISEASE_EXPLAIN : DISEASE_EXPLAIN
    }),
    new CopyWebpackPlugin([{ from: "./src"}]),
   
  ],
  devServer: { 
    static: {
    // https://webpack.js.org/configuration/dev-server/#directory
    directory: path.join(__dirname, 'dist'),
    }, 
  compress: true
  },
  node: {
    fs:"empty"
  }
}