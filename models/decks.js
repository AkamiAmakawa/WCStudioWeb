const { DataTypes } = require('sequelize');
const Character = require('./characters');
var db_sequelize = require('./db_sequelize');
const UserAccount = require('./user');
const DeckList = db_sequelize.define("deckList", {
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
        allowNull: true,
    },
});
Character.hasMany(DeckList, {
    foreignKey: 'character_id'
})
DeckList.belongsTo(Character, {
    foreignKey: "character_id"
})
DeckList.belongsTo(UserAccount, {
    foreignKey: 'user_id'
})
UserAccount.hasMany(DeckList, {
    foreignKey: "user_id"
})

module.exports = DeckList