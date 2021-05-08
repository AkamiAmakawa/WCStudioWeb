const { DataTypes } = require("sequelize")
var db_sequelize = require("./db_sequelize");
const UserAccount = require("./user");
var UserInfo = db_sequelize.define('userInfo', {
    id: {
        type: DataTypes.INTEGER,
        allowNull : false,
        primaryKey: true,
        
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    permissionLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
})
module.exports = UserInfo;