var path = require('path');
var express = require('express');
var logger = require('morgan');
var app = express();
var path = require('path');
var db_process = require('./database_process');
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
  if(request.body.id == 0){
    db_process.sendArticle(request.body.category, request.body.article_name, request.body.article_content);
  }
  else{
    db_process.editArticle(request.body.article_id, request.body.category, request.body.article_name, request.body.article_content);
  }
    response.redirect('/');
});

//Linking file and page

//New display page
app.get('/news/:id',async (req,res) => {
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
app.get('/news', async (req, res) =>{
  var data = await db_process.getArticlesID("news", 1000, "desc");
  res.render("news_list", {data: data});
})

// Route for everything else.
app.get('*', async function(req, res){
  var data = await db_process.getArticlesID("news", 3, "desc");
  res.render("index", {data: data});
});

//Start server
app.listen(3000);
console.log('Listening on port 80');