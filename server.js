var path = require('path');
var express = require('express');
var logger = require('morgan');
var app = express();
var path = require('path');
var db_process = require('./database_process');

// Variable for controlling news listing page
//   current/total is the current/total page
//   per_page is max number of articles per page
//   max_show_page is the max number of page in pagination bar of each side for example 2 will be << 2 3 4 5 6 >> assume current page is 4
var news_list_pagination = {current: 1, total: 1, per_page: 5, max_show_page: 2};
const { cache } = require('ejs');
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

//Connect to the database
db_process.connect;

//Send data to MySQL Server

app.post('/post', function(request, response){
  if(request.body.article_id == 0){
    db_process.sendArticle(request.body.category, request.body.article_name, request.body.article_content);
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
    res.render("new", {data: data[0]});
  }
})

//Create new article

app.get('/new_article', (req,res) => {
  var data = {id : "0", a_name : "", content: ""};
  res.render("article_editor", {data: data});
}) 

//Edit existing article

app.get('/edit_article/:id', async (req, res) => {
    var data = await db_process.getArticle(req.params.id);
    res.render("article_editor", {data: data[0]});
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
  res.render("news_list", {data: data, pag: news_list_pagination});
})

// Route for everything else.
app.get('*', async function(req, res){
  var data = await db_process.getArticlesID("news", 3, "desc");
  res.render("index", {data: data});
});

//Start server
app.listen(3000);
console.log('Listening on port 80');