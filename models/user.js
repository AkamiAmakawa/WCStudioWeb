const { DataTypes} = require("sequelize")
var db_sequelize = require("./db_sequelize")
var bcrypt = require('bcrypt');
const UserInfo = require("./user_info");
const Article = require("./articles");
const Comment = require("./comment");
const UserAccount = db_sequelize.define('UserAccount', {
    id: {
        type: DataTypes.INTEGER,
        allowNull : false,
        primaryKey: true,
        autoIncrement: true,
        
    },
    email: {
        type: DataTypes.STRING,
        allowNull : false,
        unique: true,
        validate:{
            customValidation(value,next){
                UserAccount.findAll({attributes: ['id'], where: {email : value,}}).then((result) => {
                    if(result.length){
                        return next(new Error('Email already exist'));
                    }
                    else{
                        return next();
                    }
                }) 
            }
        }  
    },
    username: {
        type: DataTypes.STRING,
        allowNull : false,
        unique: true,
        validate:{
            customValidation(value,next){
                UserAccount.findAll({attributes: ['id'], where: {username : value,}}).then((result) => {
                    if(result.length){
                        return next(new Error('Username already exist'));
                    }
                    else{
                        return next();
                    }
                }) 
            }
        } 
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    hooks: {
      beforeCreate: (user) => {
          
        //Encrypt the password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      },
      afterCreate: (user) =>{
            UserInfo.create({
                id: user.id,
                displayName: user.username,
            })
          }
      }  
});
UserAccount.prototype.validPassword = (user, password) =>{
    try {
        return bcrypt.compareSync(password, user.password);
    } catch (error) {
        console.log(error);
        return false;
    }
};


UserAccount.hasOne(UserInfo, {
        foreignKey: {
            name: 'id'
        }
});
UserAccount.hasMany(Article, {
    foreignKey: {
        name: 'authorId'
    }
})
UserInfo.belongsTo(UserAccount, {
    foreignKey: {
        name: 'id'
    }
});
Article.belongsTo(UserAccount, {
    foreignKey: {
        name: 'authorId'
    }
});
UserAccount.hasMany(Comment, {
    foreignKey: "authorId",
})
Comment.belongsTo(UserAccount, {
    foreignKey: "authorId",
})
// db_sequelize.sync({alter: true});
// export User model for use in other files.
module.exports = UserAccount;