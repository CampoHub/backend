const sequelize = require("../config/database");
const User = require("./User");
const Plot = require("./Plot");
const Activity = require("./Activity");
const Resource = require("./Resource");
const Worker = require("./Worker");

module.exports = {
  sequelize,
  User,
  Plot,
  Activity,
  Resource,
  Worker
};

