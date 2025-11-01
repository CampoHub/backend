'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('activity_assignments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('activity_assignments');
  }
};