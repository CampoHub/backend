const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Worker = sequelize.define("Worker", {
  especialidad: { type: DataTypes.STRING, allowNull: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: "workers",
  timestamps: true,
});

User.hasOne(Worker, { foreignKey: "id_usuario" });
Worker.belongsTo(User, { foreignKey: "id_usuario" });

module.exports = Worker;
