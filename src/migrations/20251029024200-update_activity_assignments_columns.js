'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero eliminamos la tabla si existe
    await queryInterface.dropTable('activity_assignments');

    // Luego creamos la tabla con la estructura correcta
    await queryInterface.createTable('activity_assignments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
      worker_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pendiente', 'en_progreso', 'completada', 'cancelada'),
        allowNull: false,
        defaultValue: 'pendiente'
      },
      rol: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'operador'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Añadimos los índices necesarios
    await queryInterface.addIndex('activity_assignments', ['activity_id', 'worker_id'], {
      name: 'idx_activity_worker'
    });

    await queryInterface.addIndex('activity_assignments', ['worker_id'], {
      name: 'idx_worker'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('activity_assignments');
  }
};