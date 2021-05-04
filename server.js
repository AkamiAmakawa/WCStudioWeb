//Require module

var path = require('path');
var express = require('express');
var logger = require('morgan');
var app = express();
var db_process = require('./database_process');

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const authRouter = require("./auth");
require("dotenv").config();

// Variable for controlling news listing page
//   current/total is the current/total page
//   per_page is max number of articles per page
//   max_show_page is the max number of page in pagination bar of each side for example 2 will be << 2 3 4 5 6 >> assume current page is 4
var news_list_pagination = {current: 1, total: 1, per_page: 5, max_show_page: 2};
const { cache } = require('ejs');



//Connect to the database
db_process.connect;

//Authentication setup
const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
};

if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}


/**
 * Passport Configuration
 */

 const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  }
);

//                                APP CONFIGURATION

// Log the requests
app.use(logger('dev'));
//Change display to EJS
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
// Serve static files
app.use(express.static(path.join(__dirname, 'public'))); 

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(expressSession(session));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use("/", authRouter);
//Send data to MySQL Server

app.post('/post', function(request, response){
  if(request.body.article_id == 0){
    db_process.sendArticle(request.body.category, request.body.author, request.body.article_name, request.body.article_content);
  }
  else{
    db_process.editArticle(request.body.article_id, request.body.category, request.body.article_name, request.body.article_content);
  }
    response.redirect('/');
});

//Linking file and page

//Article display page
app.get('/a/:id',async (req,res) => {
  var data = await db_process.getArticle(req.params.id);
  if(!data.length){
    res.sendStatus(404);
  }
  else{
    res.render("new", {data: data[0], user: req.user});
  }
})

//Create new article

app.get('/new_article', (req,res) => {
  var data = {id : "0", a_name : "", content: ""};
  if(!req.user){
    res.redirect("/");
  }
  else{
  res.render("article_editor", {data: data,user: req.user});
  }
}) 

//Edit existing article

app.get('/edit_article/:id', async (req, res) => {
  if(!req.user){
    res.redirect("/");
  }
  else{
    var data = await db_process.getArticle(req.params.id);
    res.render("article_editor", {data: data[0],user: req.user});
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
  news_list_pagination.total = Math.ceil(totalArticles.length/news_list_pagination.per_page);
  if(req.params.page > news_list_pagination.total || req.params.page < 1){
    res.sendStatus(404);
  }
  var start_article = (news_list_pagination.current - 1) * news_list_pagination.per_page;
  var end_article = start_article + news_list_pagination.per_page;
  data = totalArticles.slice(start_article, end_article);
  res.render("news_list", {data: data, pag: news_list_pagination,user: req.user});
})

// Route for everything else.
app.get('*', async function(req, res){
  var data = await db_process.getArticlesID("news", 3, "desc");
  console.log(req.user);
  res.render("index", {data: data,user: req.user});
});

//Start server
app.listen(3000);
console.log('Listening on port 3000');