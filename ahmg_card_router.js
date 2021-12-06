const express = require("express")
const router = express.Router()
const battle_process = require("./battle_history_process")
const Card = require("./models/cards")
const auth = require("./auth")
const UserAccount = require("./models/user")
const UserInfo = require("./models/user_info")


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
        return res.render("match_history_list", {user: req.session.user, data : battle_data});
    }

    if(req.session.user){
        return res.redirect("/match_history/" + req.session.user.id)
    }
    res.redirect("/")
  })
  //Card input page

  router.route("/card_input").get((req, res) => {
    if(!req.session.user || req.session.user.userInfo.permissionLevel < 3){
        return res.redirect("/");
      }
    res.render("card_input", {user: req.session.user});  
  })
  .post((req, res) => {
      Card.create({
          name: req.body.name,
          cost: req.body.cost,
          rank: req.body.rank,
          description: req.body.description,
          character_id: '1'
      }).catch(error => {
          console.log(error)
      })
      return res.redirect("/")
  })


  //Most used deck page
  router.route("/most_used_deck").get(async (req, res) => {
    most_used_deck = await battle_process.getMostUsedDeck()
    console.log(most_used_deck)
    return res.render("most_used_deck", {user: req.session.user, most_used_deck : most_used_deck[0]});  
  })



  //                                                Route for game client
  router.route("/ahmg_card/login").post(async (req, res) => {
    user = await UserAccount.findOne({
      where :{
        email : req.body.email
      },
      attributes : ['id', 'username', 'email', 'password'],
      include: {
        model: UserInfo,
        attributes : ['displayName'],
      },
    })
    if(user && user.validPassword(user, req.body.password)){
      delete user.password
      user.toJSON()
      res.json(user)
    }
    else{
      res.status(404).send("Can't login")
    }
  })

  router.route("/ahmg_card/send_battle_result").put((req, res) => {
      console.log(req.body);
      battle_process.uploadBattleData(req.body);
      res.sendStatus(200);
  })
  
  
module.exports = router;