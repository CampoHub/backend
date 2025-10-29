const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Worker extends Model {
    static associate(models) {
      // Define associations here
      Worker.belongsTo(models.User, { foreignKey: "id_usuario" });
      models.User.hasOne(Worker, { foreignKey: "id_usuario" });
    }
  }

  Worker.init(
    {
      especialidad: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Worker",
      tableName: "workers",
      timestamps: true,
    }
  );

  return Worker;
};
