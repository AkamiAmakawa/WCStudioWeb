const UserAccount = require("./user");
const UserInfo = require("./user_info");
const Article = require("./articles");

module.exports = function () {
    UserInfo.belongsTo(UserAccount);
    Article.belongsTo(UserAccount);
}