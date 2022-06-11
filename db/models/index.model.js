/* eslint-disable comma-dangle */
import { Sequelize } from "sequelize";
import allConfig from "../../sequelize.config.cjs";

import initItemModel from "./item.mjs";
import initCategoryModel from "./category.mjs";

const env = process.env.NODE_ENV || "development";
// this is the same as saying :
// const config = allConfig['development']
const config = allConfig[env];
const db = {};

let sequelize;

if (env === "production") {
  // Break apart the Heroku database url and rebuild the configs we need
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(":"));
  const password = dbUrl.auth.substr(
    dbUrl.auth.indexOf(":") + 1,
    dbUrl.auth.length
  );
  const dbName = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
  sequelize = new Sequelize(dbName, username, password, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}
// initiate a new instance of Sequelize
// note similarity to pool.query

// here we are putting initItemModel from item.mjs into the object "db" (line 14)
db.Item = initItemModel(sequelize, Sequelize.DataTypes);
db.Category = initCategoryModel(sequelize, Sequelize.DataTypes);

// A    belongsTo     B
db.Item.belongsTo(db.Category);
// A      hasMany      B
db.Category.hasMany(db.Item);

// here we are putting the instance we created in line 28 into the object "db"
db.sequelize = sequelize;
// db = {
//     Item: initItemModel(sequelize, Sequelize.DataTypes),
//    sequelize: sequelize
// }

export default db;
