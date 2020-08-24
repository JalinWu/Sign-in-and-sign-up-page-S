const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const file = "./account.db";
const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
const { forwardAuthenticated } = require('../config/auth');

// Register
router.post('/register', (req, res) => {
  var { name, email, password, password2 } = req.body;
  var errors = [];

  // 新增判斷：'欄位不可為空'



  // 新增判斷：'請勿輸入特殊字元'



  // 新增判斷：'密碼長度要大於 6'



  // 新增判斷：'密碼不相同'



  // 如果有 error，回到 register 頁面
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    db.serialize(() => {
      // 創建 TABLE



      // 定義 query：查詢 email 是否存在
      

      
      // 執行 query



        // 新增判斷：如果 email 存在，回到 register 頁面       



        // 新增判斷：否則將密碼進行 bcrypt 加密後，新增進資料庫


        
    })

  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));


module.exports = router;
