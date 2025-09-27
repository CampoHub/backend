const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Plot = require("./Plot");

const Activity = sequelize.define("Activity", {
  nombre: { type: DataTypes.STRING, allowNull: false },
  tipo: { type: DataTypes.STRING, allowNull: false },
  fecha_inicio: { type: DataTypes.DATE, allowNull: false },
  fecha_fin: { type: DataTypes.DATE, allowNull: false },
  estado: {
    type: DataTypes.ENUM("pendiente", "en progreso", "completada"),
    defaultValue: "pendiente"
  },
  id_parcela: { // Añadimos la definición explícita aquí
    type: DataTypes.INTEGER,
    allowNull: true // Permitimos NULL para ser consistente con la migración
  }
}, {
  tableName: "activities",
  timestamps: true,
});

Plot.hasMany(Activity, { foreignKey: "id_parcela", onDelete: 'SET NULL' });
Activity.belongsTo(Plot, { foreignKey: "id_parcela" });

module.exports = Activity;
