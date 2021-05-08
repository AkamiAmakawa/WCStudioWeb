const { DataTypes } = require('sequelize');
var db_sequelize = require('./db_sequelize');
const UserAccount = require('./user');
var Article = db_sequelize.define("Article", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    a_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
})
// UserAccount.associate = function associate({Article}) {
//     return UserAccount.hasMany(Article, {
//         foreignKey : 'authorId',
//       });
  
// };
module.exports = Article;