const express = require("express");
const UserAccount = require("./models/user");
const UserInfo = require("./models/user_info");
const router = express.Router();
const battle_process = require("./battle_history_process");
const { Op } = require("sequelize");
//Routing
router.route("/user/:username/:action?").get((req, res) => {
    UserAccount.findOne({
        where : {
            [Op.or]:[
            {username : req.params.username},
            {id: req.params.username}
            ]
        },
        include: UserInfo
    }).then(user => {
        if(user){
            user = user.toJSON();
            
            if(req.params.action == 'edit' && req.session.user && (req.session.user.id == user.id|| req.session.user.userInfo.permissionLevel > 2)){
                user.edit = true;
            } else {
                user.edit = false;
            }
            res.render("profile", {user : req.session.user, data : user});
        } else {
            res.redirect("/")
        }
    })
}).post( async (req,res) =>{
    UserAccount.findOne({attributes: ['id'], where: {username : req.params.username}}).then(identity => {
        id = identity.id;
        displayName = req.body.displayName;
        date_of_birth = req.body.dob;
        description = req.body.des;
        UserInfo.update({
            displayName : displayName, date_of_birth: date_of_birth, description: description,
        },{
            where:{
                id : id
            }
        }).then(async () =>{
                req.session.user = await UserAccount.findByPk(id, {include: UserInfo});
                res.redirect("/user/" + req.params.username);
            }).catch(error =>{
                console.log(error);
                res.redirect("/user/" + req.params.username + "/edit");
            })
    })
    })



//Match history page

  router.route("/match_detail/:id").get(async (req, res) => {

    move_data = await battle_process.getBattleMove(req.params.id);

    move_list = []
    last_turn = 0
    for (move of move_data){
        while(last_turn < move.turn){
            last_turn ++
            move_list[last_turn] = []
        }
        move_list[last_turn].push(move)
    }
    console.log(move_list)
    battle_data = await battle_process.getBattleDetail(req.params.id)
    res.render("matches_history", {user: req.session.user, move_list : move_list, battle_data : battle_data})
  })


  router.route("/match_history/:id?").get(async (req, res) => {
    if(req.params.id){
        battle_data = await battle_process.getBatleHistory(req.params.id);
        res.render("match_history_list", {user: req.session.user, data : battle_data});
    }

    if(req.session.user){
        res.redirect("/match_history/" + req.session.user.id)
    }
    res.redirect("/")
  })
  //Card input page
  router.route("/card_input").get((req, res) => {
    res.render("card_input", {user: req.session.user});  
  })

  router.route("/ahmg_card_data/send_battle_result").put((req, res) => {
      console.log(req.body);
      battle_process.uploadBattleData(req.body);
  })
  
  

//Export
module.exports = router;