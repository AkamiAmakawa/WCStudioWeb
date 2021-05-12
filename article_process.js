const Article = require("./models/articles");
const UserAccount = require("./models/user");
const UserInfo = require("./models/user_info");
const moment = require('moment');
const Comment = require("./models/comment");
exports.sendArticle = async function (category, author, name, content) {
  //function to send article to database
    await Article.create({
      category : category,
      authorId: author,
      a_name: name,
      content: content,
    }).catch(error =>{
      throw error;
    })
};

exports.editArticle = async function (id, category, name, content) {
  await Article.update({category: category, a_name: name, content: content},{
    where: {
      id : id,
    }
  }).catch(error =>{
    throw error;
  });
}

exports.getArticlesID = async function (category, amount, sort) {
/*Get a number of article from database
    category: category of articles to get
    amount: the number of articles to get
    sort: asc/desc get the articles by ascending/descending id
*/
    var raw_data = await Article.findAll({
      attributes: ['id', 'a_name', 'createdAt'],
      where :{
        category : category,
      },
      order:[
        ['createdAt', sort],
      ],
      limit : amount,
    }).catch(error =>{
      throw error;
    });
    var data = [];
    for(sub of raw_data){
      sub = sub.toJSON();
      sub.createdAt.toUTCString();
      sub.createdAt = moment(sub.createdAt).local().format("DD/MM/YYYY HH:mm");
      data.push(sub);
    }
    return data;
  }


exports.getArticle = async function (id) {
  var data = await Article.findByPk(id, {include: [
    {
      model: UserAccount,
      attributes: ['username'],
      include: [
        {
          model: UserInfo,
          attributes: ['displayName'],
        },
      ],
    },
  ],}).catch(error =>{
    throw error;
  });
    data = data.toJSON();
    data.createdAt.toUTCString();
    data.createdAt = moment(data.createdAt).local().format("DD/MM/YYYY HH:mm");
  return data;
  //Get an article from the database by id
  // command = `select * from articles where id = \'${id}\'`
  // return new Promise(function (resolve, reject) {
  //   con.query(command, function (err,rows) {
  //     if(err) {
  //       return reject(err);
  //     }
        
  //       //Process data to change date to local time
  //       for(data of rows){
  //         data.a_date.toUTCString();
  //         data.a_date = moment(data.a_date).local().format("DD/MM/YYYY HH:mm");
  //       }

  //     resolve(rows);
  //   })
  // })
}

//Delete an article from database

exports.deleteArticle = async function (id) {
  Article.destroy({
    where: {
      id : id
    }
  }).catch(error =>{
    throw error;
  })
}

exports.getComment = async function (id) {
  var raw_data = await Comment.findAll({
    where:{
      articleId: id,
    }, include: [
      {
        model: UserAccount,
        attributes: ['username'],
        include: [
          {
            model: UserInfo,
            attributes: ['displayName'],
          },
        ],
      },
    ]
  }).catch(error =>{
    throw error;
  })
  var data = [];
  for(sub of raw_data){
    sub = sub.toJSON();
    sub.createdAt.toUTCString();
    sub.createdAt = moment(sub.createdAt).local().format("DD/MM/YYYY HH:mm");
    data.push(sub);
  }
  return data;
}
