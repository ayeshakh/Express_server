app.get("/urls", (req, res) => {
let id =req.cookies["user_id"]
let list = {};
function urlsForUser(id){
  for (urlDatabase[shortURL] in urlDatabase){
    if(id === urlDatabase[shortURL].id]){
      list += {shortURL: url[shortURL], longURL: longURL[longURL]}
    }
  }
return list;
}

urlsForUser();