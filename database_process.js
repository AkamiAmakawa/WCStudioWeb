var mysql = require('mysql');

var con = mysql.createConnection({
  host: "db4free.net",
  user: "wcstudio",
  password: "wcstudio",
  database: "wcsarticles"
});
exports.sendArticle = function (category, name, content) {
con.connect(function(err) {
  if (err) throw err;
  //function to send article to database
    command = `insert into articles(category, a_name, content) values (\'${category}\', \'${name}\', \'${content}\');`;
    console.log(command);
    con.query(command, function (err, result, fields){
        if(err) throw err;
        console.log(fields);
    });
});
};
