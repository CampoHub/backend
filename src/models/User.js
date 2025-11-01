const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
    }
  }

  User.init({
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  contraseña: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM("admin", "gestor", "trabajador"), allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    sequelize,
    tableName: "users",
    timestamps: true,
    modelName: 'User'
  });

  return User;
};
