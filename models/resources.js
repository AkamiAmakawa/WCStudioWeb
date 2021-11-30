const { DataTypes} = require("sequelize")
const Card = require("./cards")
const Character = require("./characters")
var db_sequelize = require("./db_sequelize")
const DeckList = require("./decks")
const UserInfo = require("./user_info")

const Resources = db_sequelize.define("resource", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name:{
        type: DataTypes.CHAR(50),
        allowNull: false,
    },
    address:{
        type: DataTypes.TEXT,
        allowNull: false
    },
})

Resources.hasMany(Card, {
    foreignKey: "display_image"
})
Resources.hasMany(UserInfo, {
    foreignKey: "user_avatar"
})
Resources.hasMany(DeckList, {
    foreignKey: "display_image"
})
Resources.hasMany(Character, {
    foreignKey: "display_image"
})

Card.belongsTo(Resources, {
    foreignKey: "display_image"
})

UserInfo.belongsTo(Resources, {
    foreignKey: "user_avatar"
})

DeckList.belongsTo(Resources, {
    foreignKey: "display_image"
})

Character.belongsTo(Resources, {
    foreignKey: "display_image"
})

module.exports = Resources;