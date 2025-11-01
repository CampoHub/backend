const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ActivityAssignment extends Model {
    static associate(models) {
      ActivityAssignment.belongsTo(models.Activity, {
        foreignKey: 'activity_id',
        as: 'activity'
      });
      
      ActivityAssignment.belongsTo(models.Worker, {
        foreignKey: 'worker_id',
        as: 'worker'
      });
    }
  }

  ActivityAssignment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    worker_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isAfterStartDate(value) {
          if (value && value < this.start_date) {
            throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
          }
        }
      }
    },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isAfterStartDate(value) {
        if (value && value <= this.start_date) {
          throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pendiente', 'en_progreso', 'completada', 'cancelada'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
  status: {
    type: DataTypes.ENUM('pendiente', 'en_progreso', 'completada', 'cancelada'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  rol: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'operador',
    validate: {
      isIn: [['operador', 'supervisor', 'ayudante']]
    }
  }
}, {
  sequelize,
  modelName: 'ActivityAssignment',
  tableName: 'activity_assignments',
  underscored: true
});

  return ActivityAssignment;
};