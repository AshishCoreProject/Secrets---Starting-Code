//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const session = require("express-session");
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

//use a session
app.use(session({
  secret : "This is our little secret.",
  resave : false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set('strictQuery', false);// this is used for removing deprecration warning!
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser : true});

//create a schema
const userSchema = new mongoose.Schema({
  email : String,
  password : String
})

//we add to our mongoose Schema  as a plugin.
//plugin as we know is mini package of code.
userSchema.plugin(passportLocalMongoose);

//create a Model
const User = mongoose.model("user",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

//adding secret route
app.get("/secrets", function(req, res){
  if(req.isAuthenticated() ){
    res.render("secrets");
  }else{
    redirect("/login");
  }
});

//updating register route
app.post("/register", function(req, res){
  User.register({username : req.body.username}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
        passport.authenticate('local')(req, res, function(){
          res.redirect("/secrets");
        });
    }
  });
});

//empty these
app.post("/login", function(req, res){

});



app.listen(3000,function(req, res){
  console.log("Server is running on PORT 3000!");
});
