'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activity_resources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      activity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'activities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      resource_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'resources',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      cantidad: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'en_uso', 'devuelto'),
        defaultValue: 'pendiente',
        allowNull: false
      },
      fecha_asignacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fecha_devolucion: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Índice compuesto para actividad y recurso
    await queryInterface.addIndex('activity_resources',
      ['activity_id', 'resource_id'],
      {
        name: 'idx_activity_resource'
      }
    );

    // Índice por resource_id
    await queryInterface.addIndex('activity_resources',
      ['resource_id'],
      {
        name: 'idx_resource'
      }
    );

    // Índice por estado
    await queryInterface.addIndex('activity_resources',
      ['estado'],
      {
        name: 'idx_estado'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('activity_resources');
  }
};