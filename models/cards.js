const { DataTypes } = require('sequelize');
const Character = require('./characters');
var db_sequelize = require('./db_sequelize');
const Card = db_sequelize.define("card", {
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
    rank:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cost:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description:{
        type: DataTypes.TEXT,
        allowNull:true
    },
})

module.exports = Card
