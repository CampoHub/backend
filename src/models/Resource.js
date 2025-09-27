const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Plot = require("./Plot");

const Resource = sequelize.define("Resource", {
  tipo: { type: DataTypes.STRING, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  disponible: { type: DataTypes.BOOLEAN, defaultValue: true },
  id_parcela: { // Añadimos la definición explícita
    type: DataTypes.INTEGER,
    allowNull: true // Permitimos NULL para ser consistente con la migración
  }
}, {
  tableName: "resources",
  timestamps: true,
});

Plot.hasMany(Resource, { foreignKey: "id_parcela", onDelete: 'SET NULL' });
Resource.belongsTo(Plot, { foreignKey: "id_parcela" });

module.exports = Resource;
