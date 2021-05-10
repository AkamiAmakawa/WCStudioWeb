const { Sequelize } = require("sequelize");
var sequelize = require("sequelize");
module.exports = new Sequelize({
    dialect: "mysql",
    storage: "database/db.mysql",
    host:  process.env.HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    pool: {
        max: 10,
        min: 1,
        acquire: 60000,
        idle: 10000
      }
})
