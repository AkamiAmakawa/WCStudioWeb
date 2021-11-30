const { DataTypes } = require('sequelize');
const CardAttributeList = require('./attributes');
const Card = require('./cards');
var db_sequelize = require('./db_sequelize');
const CardAttribute = db_sequelize.define("cardAttribute", {}, {timestamps: false});

CardAttributeList.belongsToMany(Card, {
    through: CardAttribute
});
Card.belongsToMany(CardAttributeList, {
    through: CardAttribute
})
module.exports = CardAttribute;