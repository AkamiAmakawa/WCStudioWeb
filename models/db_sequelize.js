const { Sequelize } = require("sequelize");
require("dotenv").config();
var sequelize = require("sequelize");
module.exports = new Sequelize({
    dialect: "mysql",
    storage: "database/db.mysql",
    host: "db4free.net",
    username: "wcstudio",
    password: "wcstudio",
    database: "wcsarticles",
    pool: {
        max: 20,
        min: 0,
        acquire: 60000,
        idle: 10000
      }
})
