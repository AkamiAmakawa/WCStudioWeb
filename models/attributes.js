const { DataTypes } = require('sequelize');
var db_sequelize = require('./db_sequelize');
const CardAttributeList = db_sequelize.define("cardAttributeList", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name:{
        type: DataTypes.CHAR(30),
        allowNull: false
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: true
    }
});


module.exports = CardAttributeList;