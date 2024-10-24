const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false, httpOnly: true}
}));

app.use(express.static(path.join(__dirname, 'views')));

app.get('/login', (req,res)=>{
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req,res)=>{
  const {username, password} = req.body;

  if(username === 'bini' && password === '1004'){
    req.session.user = {username, role: 'admin'};
    res.redirect('/dashboard');
  } else {
    res.status(401).send('인증 실패');
  }
});

app.get('/dashboard', (req,res)=>{
  if(req.session.user){
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
  } else {
    res.redirect('/login');
  }
});

app.get('/api/user', (req,res)=>{
  if(req.session.user){
    res.json({username: req.session.user.username});
  } else {
    res.status(401).json({message: '로그인이 필요합니다'});
  }
});

app.get('/logout', (req,res)=>{
  req.session.destroy(err=>{
    if(err){
      return res.status(500).send('로그아웃 중 오류가 발생했습니다.');
    }
    res.clearCookie('connect.sid');
    res.redirect('/logout');
  });
});

app.listen(3000, ()=>{
  console.log('서버가 3000번에서 실행 중입니다.');
});