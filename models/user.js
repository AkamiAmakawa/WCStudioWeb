const { DataTypes } = require("sequelize")
var db_sequelize = require("./db_sequelize")
var bcrypt = require('bcrypt');
const { afterCreate } = require("./user_info");
const UserInfo = require("./user_info");
const Article = require("./articles")
var UserAccount = db_sequelize.define('UserAccount', {
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
    },
    username: {
        type: DataTypes.STRING,
        allowNull : false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    hooks: {
      beforeCreate: (user) => {
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
        throw new Error(error);

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
// export User model for use in other files.
module.exports = UserAccount;