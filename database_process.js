var mysql = require('mysql');
var moment = require('moment');
var con = mysql.createConnection({
  host: "db4free.net",
  user: "wcstudio",
  password: "wcstudio",
  database: "wcsarticles",
  dateStrings:true
});
exports.connect = function () {
con.connect(function(err) {
      if (err) throw err;
  });
}

exports.sendArticle = function (category, name, content) {
  //function to send article to database
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    command = `insert into articles(category, a_name, a_date, content) values (\'${category}\', \'${name}\', \'${date}\', \'${content}\');`;
    console.log(command);
    con.query(command, function (err, result, fields){
        if(err) throw err;
        console.log(fields);
    });
};
exports.getArticlesID = function (type, amount, sort) {
/*Get a number of article from database
    type: type of articles to get
    amount: the number of articles to get
    sort: asc/desc get the articles by ascending/descending id
*/
    command = `select id from articles where type = \'${type}\' order by id \'${sort}\' limit \'${amount}\'`;
    con.query(command, function (err,rows) {
      if(err) throw err;
      console.log(rows);
      return rows;
    })

}

exports.getArticle = async function (id) {

  //Get an article from the database by id
  command = `select * from articles where id = \'${id}\'`
  return new Promise(function (resolve, reject) {
    con.query(command, function (err,rows) {
      if(err) {
        return reject(err);
      }
      resolve(rows);
    })
  })
}