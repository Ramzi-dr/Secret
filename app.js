//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose')
const app = express();

const secret = process.env.SECRET;
const encrypt = require('mongoose-encryption')
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect('mongodb://localhost:27017/userDB');
const usersSchema = new mongoose.Schema({
  email: String,
  password: String
});

usersSchema.plugin(encrypt,{secret: secret, encryptedFields:['password']});



const User =  new mongoose.model('User',usersSchema);

app.get('/',(req,res)=>{res.render('home')});
app.get('/login',(req,res)=>{res.render('login')});
app.get('/register',(req,res)=>{res.render('register')});

app.post('/register',(req,res)=>{
   const username =req.body.username;
   const password = req.body.password;
   const newUser = new User({
     email:username,
     password:password
   });
   if(username.length> 5 || password.length>3){
  newUser.save((err)=>{if(err){console.log(err)}else{res.render('secrets')}})
   }
});

app.post('/login',(req,res)=>{
  const username =req.body.username;
  const password = req.body.password;
  User.findOne({email: username},(err,foundUser)=>{
    if(err){
      console.log(err)
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render('secrets');
        }
      }
    }
  }
  )
})






app.listen(3000, ()=>{console.log('im up and running')});
