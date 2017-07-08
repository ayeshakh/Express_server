var express = require("express");
var app = express();
var cookieParser = require('cookie-parser')
var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs")

const statuscode = 400;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

const bcrypt = require('bcrypt');

var cookieSession = require('cookie-session')

app.use(cookieSession({
  name: 'session',
  keys: ["abcd", "sdgt"],
  maxAge: 24 * 60 * 60 * 1000
}))

const users = {
  "userRandomID": {
    user_id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    user_id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

var urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    shortURL:"b2xVn2",
    user_id:"userRandomID"
  },
    "9sm5xK": {
     longURL:"http://www.google.com",
     shortURL:"9sm5xK",
     user_id: "user2RandomID"
    }
};

var characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
length = 6 ;

function generateRandomString() {
  var stringRandom = "";
  min = Math.ceil(0);
  max = Math.floor(characters.length-1);
  for(i = length; i > 0; i--){
  stringRandom += characters[Math.floor(Math.random() * (max - min + 1)) + min];
  }
return stringRandom;
}

app.get("/", (req, res) => {
    res.redirect("/login")
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
let user_id =req.session.user_id ;
let urls = urlDatabase
let longURL = req.params.longURL;
let results = {};

  for (shortURL in urls) {
    if(urls[shortURL].user_id === user_id){
      results[shortURL] = urls[shortURL]
    }
  }
    templateVars = {
    urls : results,
    user: users[user_id]
    }
  if(user_id){
    res.render("urls_index", templateVars);
  }
  else{
    res.render("urls_login", {email: undefined})
  }
});

app.get("/login", (req, res) => {
  let user_id = req.session.user_id;
  let templateVars = {
    user: users.user_id
  }
  if(user_id){
    res.redirect("/urls")
  }
  else{
    res.render("urls_login", {email: undefined, user:users[user_id]})
  }
});

app.get("/logout", (req, res) => {
res.end("<html><body>Logout<b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
  let user_id =req.session.user_id;
  let templateVars ={
      email: undefined,
      user: users[user_id]
  }
  if(user_id){
    res.render("urls_new");
   }
  else{
     res.render("urls_login", templateVars);
   }
});

app.get("/urls/:id", (req, res) => {
let user_id =req.session.user_id
let templateVars = {
    user: users[user_id],
    shortURL: req.params.id };
  if(user_id){
    res.render("urls_show", templateVars);
  }
  else{
    res.render("urls_login", {email: undefined})
  }
});

app.get("/register", (req,res) =>{
  res.render("urls_register", {user: undefined});
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let user_id =req.session.user_id
  let longURL = req.body.longURL;

  urlDatabase[shortURL]= {longURL: longURL, shortURL: shortURL, user_id : user_id}

  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL
  let longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
});

app.post("/urls/:id", (req, res) => {
  let longURL = req.body.longURL;
  urlDatabase[req.params.id].longURL = longURL;
  res.redirect("/urls")
});

app.post("/login", (req, res) => {
  let newemail = req.body.email
  let newpassword = req.body.password
  for (let list in users){
    let myUsers = users[list];
    let user_id = myUsers.user_id;
    if((newemail === myUsers.email) && (bcrypt.compareSync(newpassword, myUsers.password))){
      req.session.user_id = user_id;
      res.redirect("/urls")
      return
    }
    else if ((newemail === myUsers.email) && (!bcrypt.compareSync(newpassword, myUsers.password))){
      res.status(403).send("Your password is incorrect. Please enter your correct password");
      return
    }
  }
  res.status(403).send("Your email cannot be found. Please register your email first");
  return;
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/")
});

app.post("/register", (req, res) => {
  let email = req.body.email
  let password = req.body.password
  const hashed_password = bcrypt.hashSync(password, 10);
  let user_id = generateRandomString();
    for (let item in users){
      let value = users[item];
      if(email === value.email){
        res.status(400).send("This email id already exists. Please enter another email id.");
        return;
      }
      else if ((email === "")|| (password === "")){
        res.status(400).send("Your email or password is empty. Please enter all the fields");
      return;
      }
    }
  req.session.user_id = user_id;
  users[user_id] = {"user_id": user_id, "email":email, "password": hashed_password}
  res.redirect("/urls")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
