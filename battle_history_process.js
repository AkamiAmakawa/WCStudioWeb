
//Get battle history list

const db_sequelize = require("./models/db_sequelize")
const moment = require('moment');
const BattleHistory = require("./models/battle_history");
const BattleMove = require("./models/battle_move_list");
exports.getBatleHistory = async (player_id) =>{
    db_sequelize.query("call sp_GetBattleListByPlayer(:id)", 
    {replacements: {id: player_id}})
    .then(raw_data => {
        var data = [];
        for(sub of raw_data){
          sub.createdAt.toUTCString();
          sub.createdAt = moment(sub.createdAt).local().format("DD/MM/YYYY HH:mm");
          data.push(sub);
        }
        console.log(data);
        return data;
    })
    .catch(error => {
        console.log(error);
    })
}

exports.getBattleMove = async (battle_id) => {
    db_sequelize.query("call sp_getBattleMoveByBattle(:id)",
    {replacements: {id: battle_id}})
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(error => {
        console.log(error);
    })
}

exports.uploadBattleData = async (battle_data) => {
    const t = await db_sequelize.transaction();
    try{
        BattleHistory.create({
            winner: battle_data.winner,
            player1_id: battle_data.player1_id,
            player2_id: battle_data.player2_id,
            deck1_id : battle_data.deck1_id,
            deck2_id : battle_data.deck2_id
        }, {transaction: t}).then( async battle => {
            for await (var move of battle_data.battleMoves) {
            await BattleMove.create({
                    move_order : move.order,
                    turn : move.turn,
                    card_id : move.card_id,
                    battle_id : battle.id
                }, {transaction : t})
            }
        }).then(() => {
            t.commit();
        }).catch(error => {
            t.rollback();
            throw error;
        })
    } catch (error){
        console.log(error);
        await t.rollback();
    }

}