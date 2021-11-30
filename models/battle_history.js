const { DataTypes } = require('sequelize');
var db_sequelize = require('./db_sequelize');
const DeckList = require('./decks');
const UserAccount = require('./user');

const BattleHistory = db_sequelize.define("battleHistory", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },

    winner:{
        type: DataTypes.SMALLINT,
        allowNull: false
    }
})

BattleHistory.belongsTo(UserAccount, {
    as: "player1",
    foreignKey: "player1_id"
})

BattleHistory.belongsTo(UserAccount, {
    as: "player2",
    foreignKey: "player2_id"
})

UserAccount.hasMany(BattleHistory, {
    as: "player1",
    foreignKey: "player1_id"
})
UserAccount.hasMany(BattleHistory, {
    as: "player2",
    foreignKey: "player2_id"
})

BattleHistory.belongsTo(DeckList, {
    as: "deck1",
    foreignKey: "deck1_id"
})
BattleHistory.belongsTo(DeckList, {
    as: "deck2",
    foreignKey: "deck2_id"
})

DeckList.hasMany(BattleHistory, {
    as: "deck1",
    foreignKey: "deck1_id"
})
DeckList.hasMany(BattleHistory, {
    as: "deck2",
    foreignKey: "deck2_id"
})

module.exports = BattleHistory