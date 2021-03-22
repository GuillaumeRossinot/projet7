const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.comments = require("./comment.model.js")(sequelize, Sequelize);
db.post = require("./post.model.js")(sequelize, Sequelize);

db.post.hasMany(db.comments, { as: "comment" });
db.comments.belongsTo(db.post, {
  foreignKey: "postId",
  as: "post_commentaire_id",
});

db.users.hasMany(db.post, { as: "post" });
db.post.belongsTo(db.users, {
  foreignKey: "userId",
  as: "users_post_id",
});

db.users.hasMany(db.comments, { as: "comment" });
db.comments.belongsTo(db.users, {
  foreignKey: "userId",
  as: "users_comment_id",
});

db.post.belongsTo(db.users, { as: "user" });


module.exports = db;
