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

// Serve static files
app.use(express.static(path.join(__dirname, 'public'))); 

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//Connect to the database
db_process.connect;

// Access the parse results as request.body
app.post('/post', function(request, response){
    db_process.sendArticle(request.body.category, request.body.article_name, request.body.article_content);
    response.redirect('/');
});

//Linking file and page

app.get('/news/:id',async (req,res) => {
  var data = await db_process.getArticle(req.params.id);
  console.log(data);
  res.render("new", {data: data});
})
app.get('/new_article', (req,res) => {
  res.render("article_editor");
}) 
// Route for everything else.
app.get('*', function(req, res){
  res.render("index");
});

// Fire it up!
app.listen(80);
console.log('Listening on port 80');