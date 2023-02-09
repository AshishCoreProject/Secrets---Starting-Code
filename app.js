//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser : true});

//create a schema
const userSchema = new mongoose.Schema({
  email : String,
  password : String
})
console.log(process.env.API_KEY);
userSchema.plugin(encrypt,{ secret:process.env.SECRET, encryptedFields: ['password','email']});


//create a Model
const User = mongoose.model("user",userSchema);

app.get("/",function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  //creating a document from a Model
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  })
});


app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser.password == password){
        res.render("secrets");
      }
    }
  });
});





app.listen(3000,function(req, res){
  console.log("Server is running on PORT 3000!")
});
