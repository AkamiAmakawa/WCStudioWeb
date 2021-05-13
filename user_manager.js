const express = require("express");
const UserAccount = require("./models/user");
const UserInfo = require("./models/user_info");
const router = express.Router();

//Routing
router.route("/user/:username/:action?").get((req, res) => {
    UserAccount.findOne({
        where : {
            username : req.params.username,
        },
        include: UserInfo
    }).then(user => {
        user = user.toJSON();
        console.log(user);
        if(req.params.action == 'edit' && req.session.user && (req.session.user.id == user.id|| req.session.user.userInfo.permissionLevel > 2)){
            user.edit = true;
        } else {
            user.edit = false;
        }

        res.render("profile", {user : req.session.user, data : user});
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


//Export
module.exports = router;