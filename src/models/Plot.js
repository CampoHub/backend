const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Plot = sequelize.define("Plot", {
  nombre: { type: DataTypes.STRING, allowNull: false },
  superficie: { type: DataTypes.DECIMAL, allowNull: false },
  tipo_cultivo: { type: DataTypes.STRING, allowNull: false },
  estado: { type: DataTypes.ENUM("sembrado", "cosechado", "en preparación"), allowNull: false },
}, {
  tableName: "plots",
  timestamps: true,
});

module.exports = Plot;
