var express = require("express");
var app = express();
var cookieParser = require('cookie-parser')
app.use(cookieParser())
var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs")
const statuscode = 400;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const bcrypt = require('bcrypt');
//const hashed_password = bcrypt.hashSync(password, 10);
// app.use(function(req, res, next){
//     res.session.user = users[req.session.user_id];
//     req.session.logged_in =
//     next();
//   })

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

var urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    shortURL:"b2xVn2",
    id:"userRandomID"
  },
    "9sm5xK": {
     longURL:"http://www.google.com",
     shortURL:"9sm5xK",
     id: "user2RandomID"
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
let id =req.cookies["user_id"];
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
  let templateVars = {
    user: users[id],
    urls: urlDatabase };

  if(id){
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
  let id = req.cookies["user_id"]
  // let templateVars = {user: undefined};
   let templateVars = {
    user: users.id
  }
  if(id){
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
  let id =req.cookies["user_id"]
  if(id){
    res.render("urls_new");
   }
   else{
     res.render("urls_login", {email: undefined})
   }
});

app.get("/urls/:id", (req, res) => {
let id =req.cookies["user_id"]
  let templateVars = {
    user: users[id],
    shortURL: req.params.id };
  if(id){
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
  let id =req.cookies["user_id"]
  console.log(id);
  let longURL = req.body.longURL;
  urlDatabase[shortURL]= {longURL: longURL, shortUrl: shortURL, id : id}
  console.log(urlDatabase);

  res.redirect("/urls");
  });

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL
  let longURL = urlDatabase[shortURL]
  res.redirect(longURL);
});

 app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
  });

app.post("/urls/:id", (req, res) => {
  let longURL = req.body.longURL
  urlDatabase[req.params.id] = longURL;
  res.redirect("/urls")
  });

app.post("/login", (req, res) => {
  let newemail = req.body.email
  let newpassword = req.body.password

  //console.log("users:" , users);
  for (let list in users){
    let number = users[list];
    //console.log(newemail, newpassword, number.email, number.password);

    if((newemail === number.email) && (bcrypt.compareSync("newpassword", hashed_password))){
      let id = number.id;
      //console.log(id);
      res.cookie("user_id", id)
      res.redirect("/urls")
      return
    }
    else if ((newemail === number.email) && bcrypt.compareSync("newpassword", hashed_password)){
      res.status(403).send("Your password is incorrect. Please enter your correct password");
      return
    }
  }

    res.status(403).send("Your email cannot be found. Please register your email first");
      return;
      //console.log("Your email cannot be found. Please register your email first");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/")
  });

app.post("/register", (req, res) => {
  let email = req.body.email
  let password = req.body.password
  const hashed_password = bcrypt.hashSync(password, 10);
  let id = generateRandomString();
  if ((email === "")|| (password === "")){
    res.status(400).send("Your email or password is empty. Please enter all the fields");
    //redirect("/register")
  }
    for (let item in users){
      let value = users[item];
      if(email === value.email){
      res.status(400).send("This email id already exists. Please enter another email id.");
      }
    }
    users[id] = {"id": id, "email":email, "password": hashed_password}
    res.cookie("user_id", id);
    res.redirect("/urls")
    console.log(users)
});



  // console.log(req.body);  // debug statement to see POST parameters
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
