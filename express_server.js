var express = require("express");
var app = express();
var cookieParser = require('cookie-parser')
//app.use(cookieParser())
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

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

//const hashed_password = bcrypt.hashSync(password, 10);
// app.use(function(req, res, next){
//     res.session.user = users[req.session.user_id];
//     req.session.logged_in =
//     next();
//   })

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

// let email = req.body.email
// let checkEmail =function(){
//   for(var y =0; y < users.length; y++){
//     if(email ==== users[id].email)
//   }
// }

//app.get("/", (req, res) => {
  //res.end("Hello!");
//});
app.get("/", (req, res) => {
    //res.end("<html><body>Hello <b>World</b></body></html>\n");
    res.redirect("/login")
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
let user_id =req.session.user_id ;
let urls = urlDatabase
//let shortURL = req.params.shortURL
let longURL = req.params.longURL;
// let list = {};
// function urlsForUser(id){
//   for (urlDatabase[shortURL] in urlDatabase){
//     if(id === urlDatabase[shortURL].id){
//       list += {shortURL: url[shortURL], longURL: longURL[longURL]}
//     }
//   }
// return list;
// }
//urlsForUser();
//app.get("/urls", (req, res) => {
  //let id = req.cookies["user_id"]

  let results = {};
  for (shortURL in urls) {
    if(urls[shortURL].user_id === user_id){
      results[shortURL] = urls[shortURL]
    }
    console.log(urls[shortURL]);
  }
  templateVars = {
    urls : results
  }
  //let templateVars = {
    //user: users[user_id],
    //urls: results };

  if(user_id){
    res.render("urls_index", templateVars);
  }
  else{
    res.render("urls_login", {email: undefined})
  }
    //console.log(users);

});

app.get("/", (req, res) => {
    //res.end("<html><body>Hello <b>World</b></body></html>\n");
    res.redirect("/login]")
});

app.get("/login", (req, res) => {
  let user_id = req.session.user_id;
  // let templateVars = {user: undefined};
   let templateVars = {
    user: users.user_id
  }
  if(user_id){
    res.redirect("/urls")
  }
  else{
    res.render("urls_login", {email: undefined})
  }
});

app.get("/logout", (req, res) => {
res.end("<html><body>Logout<b></body></html>\n");
});


  // let id =req.cookies["user_id"]
  // console.log(id);
  // let templateVars = {
  //   user: users[id],
  //   urls: urlDatabase
  // }
app.get("/urls/new", (req, res) => {
  let user_id =req.session.user_id;
  if(user_id){
    res.render("urls_new");
   }
   else{
     res.render("urls_login", {email: undefined})
   }
});

app.get("/urls/:id", (req, res) => {
let user_id =req.session.user_id
  let templateVars = {
    user: users[user_id],
    shortURL: req.params.user_id };
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
  //console.log(user_id);
  let longURL = req.body.longURL;
  urlDatabase[shortURL]= {longURL: longURL, shortURL: shortURL, user_id : user_id}
  //console.log(urlDatabase);


  res.redirect("/urls");
  });

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL
  let longURL = urlDatabase.user_id[shortURL]
  res.redirect(longURL);
});

 app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase.user_id[req.params.user_id]
  res.redirect("/urls")
  });

app.post("/urls/:id", (req, res) => {
  let longURL = req.body.longURL
  urlDatabase.user_id[req.params.user_id] = longURL;
  res.redirect("/urls")
  });

app.post("/login", (req, res) => {
  let newemail = req.body.email
  let newpassword = req.body.password


  //console.log("users:" , users);
  for (let list in users){
    let myUsers = users[list];
    //console.log(newemail, newpassword, number.email, number.password);

    if((newemail === myUsers.email) && (bcrypt.compareSync(newpassword, myUsers.password))){
      let user_id = myUsers.user_id;
      //console.log(id);
      req.session.user_id = user_id;
      res.redirect("/urls")
      return
    }
    else if ((newemail === myUsers.email) && bcrypt.compareSync("newpassword", myUsers.password)){
      res.status(403).send("Your password is incorrect. Please enter your correct password");
      return
    }
  }

    res.status(403).send("Your email cannot be found. Please register your email first");
      return;
      //console.log("Your email cannot be found. Please register your email first");
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
  if ((email === "")|| (password === "")){
    res.status(400).send("Your email or password is empty. Please enter all the fields");
    //redirect("/register")
  }
    for (let item in users){
      let value = users[item];
      if(email === value.email){
      res.status(400).send("This email id already exists. Please enter another email id.");
      return;
      }
    }
    req.session.user_id = user_id;
    users[user_id] = {"user_id": user_id, "email":email, "password": hashed_password}


    //res.cookie("user_id", id);
    res.redirect("/urls")
    //console.log(users);
});



  // console.log(req.body);  // debug statement to see POST parameters
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
