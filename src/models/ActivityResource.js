const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ActivityResource extends Model {
  static associate(models) {
    ActivityResource.belongsTo(models.Activity, {
      foreignKey: 'activity_id',
      as: 'activity'
    });
    
    ActivityResource.belongsTo(models.Resource, {
      foreignKey: 'resource_id',
      as: 'resource'
    });
  }
}

ActivityResource.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activity_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  resource_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      async isAvailable(value) {
        if (this.isNewRecord) {
          const resource = await sequelize.models.Resource.findByPk(this.resource_id);
          if (!resource) {
            throw new Error('Recurso no encontrado');
          }
          if (value > resource.cantidad_disponible) {
            throw new Error('Cantidad solicitada excede la disponible');
          }
        }
      }
    }
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en_uso', 'devuelto'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_devolucion: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isAfterAsignacion(value) {
        if (value && value <= this.fecha_asignacion) {
          throw new Error('La fecha de devolución debe ser posterior a la fecha de asignación');
        }
      }
    }
  }
}, {
  sequelize,
  modelName: 'ActivityResource',
  tableName: 'activity_resources',
  underscored: true,
  hooks: {
    beforeCreate: async (activityResource) => {
      // Actualizar cantidad disponible del recurso
      const resource = await sequelize.models.Resource.findByPk(activityResource.resource_id);
      if (resource) {
        await resource.decrement('cantidad_disponible', { by: activityResource.cantidad });
      }
    },
    beforeUpdate: async (activityResource) => {
      if (activityResource.changed('estado') && activityResource.estado === 'devuelto') {
        // Restaurar cantidad disponible al devolver el recurso
        const resource = await sequelize.models.Resource.findByPk(activityResource.resource_id);
        if (resource) {
          await resource.increment('cantidad_disponible', { by: activityResource.cantidad });
        }
      }
    }
    }
  });

  return ActivityResource;
};