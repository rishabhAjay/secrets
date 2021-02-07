//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//use environment variables with dotenv to safely hide important things
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
// mention the plugin before specifying the model for the schema
const user = mongoose.model("user", userSchema);

app.get("/", function(req, res) {
  res.render('home');
})

app.get("/login", function(req, res) {
  res.render('login');
});

app.post("/login", function(req, res) {
  const email = req.body.username;
  const password = req.body.password;
  user.findOne({email: email}, function(err, result) {
    if(result) {
      if(result.password === password) {
        res.render('secrets')
      }else {
        res.render('login');
      }
    }
  })
})

app.get("/register", function(req, res) {
  res.render('register');
});

app.post("/register", function(req, res ){
  const email = req.body.username;
  const password = req.body.password;
  var newUser = new user ({
    email: email,
    password: password
  });
  newUser.save(function(err) {
    if(!err) {
      res.render('secrets');
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server listening at port 3000");
});
