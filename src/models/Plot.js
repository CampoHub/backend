const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Plot extends Model {
  static associate(models) {
    Plot.hasMany(models.Activity, { 
      foreignKey: "id_parcela",
      as: 'activities',
      onDelete: 'SET NULL'
    });
  }
}

Plot.init({
  nombre: { type: DataTypes.STRING, allowNull: false },
  superficie: { type: DataTypes.DECIMAL, allowNull: false },
  tipo_cultivo: { type: DataTypes.STRING, allowNull: false },
  estado: { type: DataTypes.ENUM("sembrado", "cosechado", "en preparación"), allowNull: false },
}, {
  sequelize,
  modelName: "Plot",
  tableName: "plots",
  timestamps: true
  });

  return Plot;
};
