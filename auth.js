
/**
 * Required External Modules
 */
const { response } = require("express");
const express = require("express");
const router = express.Router();
const UserAccount = require("./models/user");
const UserInfo = require("./models/user_info");
var serverMsg;
 require("dotenv").config();

//Session 

var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      res.redirect('/');
  } else {
      next();
  }    
};

/**
 * Routes Definitions
 */

 router.route('/register')
 .get(sessionChecker, (req, res) => {
     res.render("auth", {response : serverMsg});
 })
 .post((req, res) => {
     UserAccount.create({
         username: req.body.username,
         email: req.body.email,
         password: req.body.password,
     })
     .then(user => {
         req.session.user = user.dataValues;
         res.redirect('/');
     })
     .catch(error => {
        console.log(error);
        serverMsg = error;
         res.redirect('/register');
     });
 });

router.route('/login').get((req, res) => {
  serverMsg = "";
  res.render('login', {response : serverMsg});
}).post((req,res) => {
  var email = req.body.email;
  var password = req.body.password;
  UserAccount.findOne({where: {email : email}, include: UserInfo})
  .then(async function (user){
      if(!user){
        serverMsg = "Incorrect email or password";
        res.render('login', {response : serverMsg});
      }
      else if(!user.validPassword(user, password)){
        serverMsg = "Incorrect email or password";
        res.render('login', {response : serverMsg});
      }
      else{
        req.session.user = user.toJSON();
        delete req.session.user.password;
        console.log(req.session.user);
        res.redirect('/');
      }
  })
})



router.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
      res.redirect('/');
  } else {
      res.redirect('/');
  }
});
/**
 * Module Exports
 */

 module.exports = router;