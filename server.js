//Require module
require("dotenv").config();
var path = require('path');
var express = require('express');
var logger = require('morgan');
var app = express();
var session = require('express-session');
const passport = require("passport");
const authRouter = require("./auth");
const userRouter = require("./user_manager");
var db_process = require('./article_process');

// Variable for controlling news listing page
//   current/total is the current/total page
//   per_page is max number of articles per page
//   max_show_page is the max number of page in pagination bar of each side for example 2 will be << 2 3 4 5 6 >> assume current page is 4
var news_list_pagination = {current: 1, total: 1, per_page: 4, max_show_page: 2};
var news_comment_pagination = {current: 1, total: 1, per_page: 3, max_show_page: 2};
const { cache } = require('ejs');
const cookieParser = require('cookie-parser');
const Article = require("./models/articles");
const Comment = require("./models/comment");
const UserAccount = require("./models/user");



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
app.use(express.urlencoded( {extended: true} ));

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
app.use("/", userRouter);
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
  res.render("product", {user: req.session.user});
})

//Article display page
app.get('/a/:id/:page?',async (req,res) => {
  if(!req.params.page){
    page = 1;
  }
  else{
    page = req.params.page;
  }
  var data = await db_process.getArticle(req.params.id);
  if(!data){
    res.sendStatus(404);
  }
  else{
    var comment_data;
    var comment = await db_process.getComment(req.params.id);
    if(!comment.length){
      news_comment_pagination.current = 1;
      news_comment_pagination.total = 1;
    }else{
      news_comment_pagination.current = page;
      news_comment_pagination.total = Math.ceil(comment.length/news_comment_pagination.per_page);
    if(page > news_comment_pagination.total || page < 1){
      news_comment_pagination.current = 1;
    }
    var start_comment = (news_comment_pagination.current - 1) * news_comment_pagination.per_page;
    var end_comment = start_comment + news_comment_pagination.per_page;
    comment_data = comment.slice(start_comment, end_comment);
  }
    res.render("news", {data: data, user: req.session.user, commentList : comment_data, pag : news_comment_pagination});
  }
})

//Create new article

app.get('/new_article', (req,res) => {
  var data = {id : "0", a_name : "", content: ""};
  if(!req.session.user || req.session.user.userInfo.permissionLevel < 2){
    res.redirect("/");
  }
  else{
  res.render("article_editor", {data: data,user: req.session.user});
  }
}) 

//Edit existing article

app.get('/edit_article/:id', async (req, res) => {
  var article = await Article.findByPk(req.params.id, {attributes: ['authorId']});
  if(!req.session.user || (req.session.user.id != article.authorId && req.session.user.userInfo.permissionLevel < 3)){
    res.redirect("/");
  }
  else{
    var data = await db_process.getArticle(req.params.id);
    if(!data){
      res.sendStatus(404);
    }else{
    res.render("article_editor", {data: data,user: req.session.user});
    }
  }
})

//Post comment

app.post('/a/:id/:page?', (req, res) => {
  if(!req.body.edit || req.body.edit < 0){
  Comment.create({
    authorId: req.body.authorId,
    articleId: req.body.articleId,
    content: req.body.comment,
  }).then(() => {
    res.redirect("/a/" + req.body.articleId);
  }).catch(error =>{
    console.log(error);
  })
}else{
  Comment.update({content : req.body.comment}, {
    where:{
      id : req.body.edit
    }
  }).then(() =>{
    res.redirect("/a/" + req.params.id);
  }).catch(error =>{
    console.log(error);
  })
}
  })

//Delete comment

app.get("/remove_cmt/:a_id/:c_id",async (req,res) =>{
  var commentId = req.params.c_id;
  var articleId = req.params.a_id;
  Comment.findByPk(commentId).then(comment =>{
    if(!req.session.user || (req.session.user.id != comment.authorId && req.session.user.userInfo.permissionLevel < 3)){
      res.redirect("/");
    }else{
      Comment.destroy({
        where:{
          id : commentId
        }
      }).catch(error => {
        console.log(error);
      })
      res.redirect("/a/" + articleId);
    }

  }).catch(error =>{
    console.log(error);
  })
})
//Delete article

app.get('/remove_article/:id', async (req, res) => {
  var article = await Article.findByPk(req.params.id, {attributes: ['authorId']});
  if(!req.session.user || (req.session.user.id != article.authorId && req.session.user.userInfo.permissionLevel < 3)){
    res.redirect("/");
  }else{
  db_process.deleteArticle(req.params.id);
  res.redirect('/');
  }
})

//Show all news

app.get('/news/:page', async (req, res) =>{
  news_list_pagination.current = req.params.page;
  var totalArticles = await db_process.getArticlesID("news", 1000, "DESC").catch(error =>{
    console.log(error);
    res.redirect('/news/' + req.params.page);
  });
  var data;
  //If there are no data
  if(!totalArticles.length){
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
  var data = await db_process.getArticlesID("news", 3, "DESC").catch(error =>{
    console.log(error);
    res.redirect('/');
  });
  res.render("index", {data: data,user: req.session.user});
});

//Start server
app.listen(3000);
console.log('Listening on port 3000');
