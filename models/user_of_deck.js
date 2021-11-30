const { DataTypes } = require('sequelize');
var db_sequelize = require('./db_sequelize');
const DeckList = require('./decks');
const UserAccount = require('./user');

const DeckUser = db_sequelize.define("deckUser", {}, {timestamps: false});

UserAccount.belongsToMany(DeckList, {
    through: DeckUser,
})

DeckList.belongsToMany(UserAccount, {
    through: DeckUser,
})

module.exports = DeckUser;