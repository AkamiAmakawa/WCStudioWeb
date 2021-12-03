const { DataTypes } = require('sequelize');
const BattleHistory = require('./battle_history');
const Card = require('./cards');
var db_sequelize = require('./db_sequelize');

const BattleMove = db_sequelize.define('battleMove', {
    move_order:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    turn:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

BattleMove.belongsTo(Card, {
    foreignKey: "card_id"
})
BattleMove.belongsTo(BattleHistory, {
    foreignKey: "battle_id"
})

Card.hasMany(BattleMove, {
    foreignKey: "card_id"
})

BattleHistory.hasMany(BattleMove, {
    foreignKey: "battle_id"
})

module.exports = BattleMove;