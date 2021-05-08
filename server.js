//Require module

var path = require('path');
var express = require('express');
var logger = require('morgan');
var app = express();
var session = require('express-session');
const passport = require("passport");
const authRouter = require("./auth");
const Association = require("./models/association");
var db_process = require('./article_process');
require("dotenv").config();

// Variable for controlling news listing page
//   current/total is the current/total page
//   per_page is max number of articles per page
//   max_show_page is the max number of page in pagination bar of each side for example 2 will be << 2 3 4 5 6 >> assume current page is 4
var news_list_pagination = {current: 1, total: 1, per_page: 4, max_show_page: 2};
const { cache } = require('ejs');
const cookieParser = require('cookie-parser');



//Connect to the database


if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}


//                                APP CONFIGURATION

// Log the requests
app.use(logger('dev'));
//Change display to EJS
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
// Serve static files
app.use(express.static(path.join(__dirname, 'public'))); 

//Test the connection

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

//Cookie parser

app.use(cookieParser());

//Cookie configuration

app.use(session({
  key: 'user_sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));

//Clear residue cookie

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});


app.use("/", authRouter);
//Send data to MySQL Server

app.post('/post', function(request, response){
  if(request.body.article_id == 0){
    db_process.sendArticle(request.body.category, request.body.authorID, request.body.article_name, request.body.article_content);
  }
  else{
    db_process.editArticle(request.body.article_id, request.body.category, request.body.article_name, request.body.article_content);
  }
    response.redirect('/');
});

//                                          Linking file and page

//Product page

app.get("/product", (req, res) => {
  res.render("product");
})

//Article display page
app.get('/a/:id',async (req,res) => {
  var data = await db_process.getArticle(req.params.id);
  if(!data){
    res.sendStatus(404);
  }
  else{
    res.render("new", {data: data, user: req.session.user});
  }
})

//Create new article

app.get('/new_article', (req,res) => {
  var data = {id : "0", a_name : "", content: ""};
  if(!req.session.user){
    res.redirect("/");
  }
  else{
  res.render("article_editor", {data: data,user: req.session.user});
  }
}) 

//Edit existing article

app.get('/edit_article/:id', async (req, res) => {
  if(!req.user){
    res.redirect("/");
  }
  else{
    var data = await db_process.getArticle(req.params.id);
    if(!data.length){
      res.sendStatus(404);
    }else{
    res.render("article_editor", {data: data[0],user: req.session.user});
    }
  }
})

//Delete article

app.get('/remove_article/:id', (req, res) => {
  db_process.deleteArticle(req.params.id);
  res.redirect('/');
})

//Show all news

app.get('/news/:page', async (req, res) =>{
  news_list_pagination.current = req.params.page;
  var totalArticles = await db_process.getArticlesID("news", 1000, "desc");
  var data;
  //If there are no data
  if(!totalArticles){
    news_list_pagination.current = 1;
    news_list_pagination.total = 1;
  }else{
  news_list_pagination.total = Math.ceil(totalArticles.length/news_list_pagination.per_page);
  if(req.params.page > news_list_pagination.total || req.params.page < 1){
    res.sendStatus(404);
  }
  var start_article = (news_list_pagination.current - 1) * news_list_pagination.per_page;
  var end_article = start_article + news_list_pagination.per_page;
  data = totalArticles.slice(start_article, end_article);
}
  res.render("news_list", {data: data, pag: news_list_pagination,user: req.session.user});
})

// Route for everything else.
app.get('*', async function(req, res){
  var data = await db_process.getArticlesID("news", 3, "desc");
  res.render("index", {data: data,user: req.session.user});
});

//Start server
app.listen(3000);
console.log('Listening on port 3000');