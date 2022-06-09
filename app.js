
const express = require("express");
const path = require("path");
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const server = express();
const mydb = require('./user_db.js');


// Read Settings
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

console.log(DISEASE_EXPLAIN);

// set static file
server.use(express.static(__dirname + ('/src') ,{index : false}));

// form body 읽을수있게 해주는 코드
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());

// 쿠키 및 세션
server.use(cookieParser());

// 세션세팅
server.use(
  expressSession({
    secret: "my key",
    resave : true,
    saveUninitialized: true,
  })
)


//포트번호 3000
server.set("port", 3000);






//기본페이지
server.get('/', (req, res) => {
  console.log('index')
  res.redirect('/home')
});

//진단페이지
server.get('/home', (req, res) => {
  if (req.session.user) {
    console.log('home console');
    res.sendFile(path.resolve("src/index.html"));
  }else{
    console.log('to_login');
    res.redirect('/login')
  }
})

//로그인페이지
server.get('/login', (req, res) => {
  if (req.session.user) {
    console.log('to_home');
    console.log(req.session.user);
    res.redirect('/home')
  }else{
    console.log('sendfile');
    res.sendFile(path.resolve('src/login.html'));
  }
})

// 로그인요청 관리
server.post('/login_post', async (req, res) => {
  if (req.session.user){
    res.redirect('/home')
  }else{
    console.log(req.body);
    let email = req.body.email;
    let password = req.body.password;
    try{
      const result = await mydb.UserDB.readUserByEmail(email);
      if (!result){
        res.json({status : 'No User'})
        return;
      }
      if (password == result.message.password){
        req.session.user = {
          name: result.name,
          nickname : result.nickname,
          phone_number : result.phone_number,
          email : result.email,
          authorized: true
        };
        res.redirect('/home');
      }else{
        res.json({startus : 'Password is different'});
      }
    }catch (err){ // 통신 자체 오류
      res.json({status : 'network failed'})
    }
  }
});

server.get('/logout',(req, res) => {
  if (req.session.user){
    req.session.destroy((err) => {
      if (err){
        console.log(err);
        return;
      }
    })
  }
  res.redirect('/login');
})

// 가입요청
server.post('/join_post', async (req, res) => {
  if (req.session.user){
    res.redirect('/home')
    return;
  }

  let name = req.body.name;
  let password = req.body.password;
  let nickname = req.body.nickname;
  let phone_number = req.body.phone_number;
  let email = req.body.email;
  try{
    const result = await mydb.UserDB.createUser(name, password, nickname, phone_number, email);
    console.log(result);
    res.redirect('/login?success=True')
  }catch(err){
    console.log(err);
    res.redirect('/join?success=False');
  }
    
});

// 읽기요청
server.get('/read', async(req, res) => {
  try{
    const result = await mydb.UserDB.readUserByPhoneNumber('01032528760');
    console.log(result);
    res.send('성공');
  }catch (err){
    res.send('실패');
    console.log(err);
  }
})


server.listen(server.get("port"), () => {
  console.log("http://localhost:" + server.get("port"));
});