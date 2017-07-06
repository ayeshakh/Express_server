var express = require("express");
var app = express();
var cookieParser = require('cookie-parser')
app.use(cookieParser())
var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs")

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

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


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
  let templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
    //res.end("<html><body>Hello <b>World</b></body></html>\n");
    res.redirect("/login]")
});

app.get("/login", (req, res) => {
res.render("./partials/_header.ejs", {username: undefined})
});

app.get("/logout", (req, res) => {
res.end("<html><body>Logout<b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

app.get("/register", (req,res) =>{
res.render("urls_register", {email: undefined});
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
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
  let username = req.body.username
  res.cookie('username', username);
  res.redirect("/urls")
  });

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/login")
  });

app.post("/register", (req, res) => {
  let email = req.body.email
  let password = req.body.password
  res.cookie('email', email);
  res.cookie('password', password);
  res.redirect("/login")
  });



  // console.log(req.body);  // debug statement to see POST parameters
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
