const { DataTypes } = require('sequelize');
var db_sequelize = require('./db_sequelize');
var Comment = db_sequelize.define("comment", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
    }
})


module.exports = Comment;