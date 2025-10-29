const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Resource extends Model {
    static associate(models) {
      Resource.belongsTo(models.Plot, { foreignKey: "id_parcela" });
    }
  }

  Resource.init({
  tipo: { type: DataTypes.STRING, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  disponible: { type: DataTypes.BOOLEAN, defaultValue: true },
  id_parcela: { // Añadimos la definición explícita
    type: DataTypes.INTEGER,
    allowNull: true // Permitimos NULL para ser consistente con la migración
  }
  }, {
    sequelize,
    tableName: "resources",
    timestamps: true,
    modelName: 'Resource'
  });

  return Resource;
};
