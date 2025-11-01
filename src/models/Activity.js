const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Activity extends Model {
  static associate(models) {

    Activity.belongsTo(models.Plot, { foreignKey: "id_parcela" });
    
    Activity.hasMany(models.ActivityAssignment, {
      foreignKey: 'activity_id',
      as: 'assignments'
    });

    Activity.hasMany(models.ActivityResource, {
      foreignKey: 'activity_id',
      as: 'resources'
    });
  }
}

Activity.init({
  nombre: { type: DataTypes.STRING, allowNull: false },
  tipo: { type: DataTypes.STRING, allowNull: false },
  fecha_inicio: { type: DataTypes.DATE, allowNull: false },
  fecha_fin: { type: DataTypes.DATE, allowNull: false },
  estado: {
    type: DataTypes.ENUM("pendiente", "en progreso", "completada"),
    defaultValue: "pendiente"
  },
  id_parcela: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  modelName: "Activity",
  tableName: "activities",
  timestamps: true
  });

  return Activity;
};
