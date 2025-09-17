const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Plot = require("./Plot");

const Resource = sequelize.define("Resource", {
  tipo: { type: DataTypes.STRING, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  disponible: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: "resources",
  timestamps: true,
});

Plot.hasMany(Resource, { foreignKey: "id_parcela" });
Resource.belongsTo(Plot, { foreignKey: "id_parcela" });

module.exports = Resource;
