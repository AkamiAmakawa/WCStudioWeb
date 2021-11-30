const { DataTypes } = require('sequelize');
const Card = require('./cards');
var db_sequelize = require('./db_sequelize');
const DeckList = require('./decks');

const Deck = db_sequelize.define("Deck", {}, {timestamps: false});

Card.belongsToMany(DeckList, {
    through: Deck
})

DeckList.belongsToMany(Card, {
    through: Deck
})

module.exports = Deck;