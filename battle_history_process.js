
//Get battle history list

const db_sequelize = require("./models/db_sequelize")
const moment = require('moment');
const BattleHistory = require("./models/battle_history");
const BattleMove = require("./models/battle_move_list");
const UserInfo = require("./models/user_info");
exports.getBatleHistory = async (player_id) =>{
    raw_data = await db_sequelize.query("call sp_GetBattleListByPlayer(:id)", 
    {replacements: {id: player_id}})
    .catch(error => {
        console.log(error);
    })
        var data = [];
        for await(sub of raw_data){
            sub.createdAt.toUTCString();
            sub.createdAt = moment(sub.createdAt).local().format("DD/MM/YYYY HH:mm");
            player1_info = await UserInfo.findByPk(sub.player1_id, {
                attributes:["displayName"]
            })
            sub.player1_info = player1_info.toJSON()
            player2_info = await UserInfo.findByPk(sub.player2_id, {
                attributes: ["displayName"]
            })
            sub.player2_info = player2_info.toJSON()
          data.push(sub);
        }
        return data;

}
exports.getBattleDetail = async (battle_id) => {
    data = await BattleHistory.findByPk(battle_id)
    .catch(error => {
        console.log(error)
    })
    if(data){
        data = data.toJSON()
        player1_info = await UserInfo.findByPk(data.player1_id, {
            attributes:["displayName"]
        })
        data.player1_info = player1_info.toJSON()
        player2_info = await UserInfo.findByPk(data.player2_id, {
            attributes: ["displayName"]
        })
        data.player2_info = player2_info.toJSON()
    }
    return data
}

exports.getBattleMove = async (battle_id) => {
    data = await db_sequelize.query("call sp_getBattleMoveByBattle(:id)",
    {replacements: {id: battle_id}})
    .catch(error => {
        console.log(error);
    })
        return data;

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