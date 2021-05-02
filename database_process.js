var mysql = require('mysql');
var moment = require('moment');
const { utc } = require('moment');
global.articleStorage;
var con = mysql.createConnection({
  host: "db4free.net",
  user: "wcstudio",
  password: "wcstudio",
  database: "wcsarticles",
  timezone : 'utc'
});
exports.connect = function () {
con.connect(function(err) {
      if (err) throw err;
  });
}


exports.sendArticle = function (category, name, content) {
  //function to send article to database
    var date = moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss");
    command = `insert into articles(category, a_name, a_date, content) values (\'${category}\', \'${name}\', \'${date}\', \'${content}\');`;
    con.query(command, function (err){
        if(err) throw err;
    });
};

exports.editArticle = function (id, category, name, content) {
    command = `update articles set a_name = \'${name}\', category = \'${category}\', content = \'${content}\' where id = ${id}`;
    console.log(command);
    con.query(command, function (err){
      if(err) throw err;
  });
}

exports.getArticlesID = async function (category, amount, sort) {
/*Get a number of article from database
    type: type of articles to get
    amount: the number of articles to get
    sort: asc/desc get the articles by ascending/descending id
*/
    command = `select id, a_name, a_date from articles where category = \'${category}\' order by id ${sort} limit ${amount}`;
    return new Promise(function (resolve, reject) {
      con.query(command, function (err,rows) {
        if(err) {
          return reject(err);
        }
        
        //Process data to change date to local time
        for(data of rows){
          data.a_date.toUTCString();
          data.a_date = moment(data.a_date).local().format("DD/MM/YYYY HH:mm");
        }

        resolve(rows);
      })
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
        
        //Process data to change date to local time
        for(data of rows){
          data.a_date.toUTCString();
          data.a_date = moment(data.a_date).local().format("DD/MM/YYYY HH:mm");
        }

      resolve(rows);
    })
  })
}

//Delete an article from database

exports.deleteArticle = function (id) {
  command = `delete from articles where id = \'${id}\'`;
  console.log(command);
    con.query(command, function (err,rows) {
      if(err) {
        return reject(err);
      }
    })
}