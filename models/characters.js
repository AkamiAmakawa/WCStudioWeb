const { DataTypes } = require('sequelize');
const Card = require('./cards');
var db_sequelize = require('./db_sequelize');
const DeckList = require('./decks');
const Character = db_sequelize.define("character", {
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
    },
})
Character.hasMany(Card, {
    foreignKey: 'character_id'
})

Card.belongsTo(Character, {
    foreignKey: 'character_id'
})

module.exports = Character;