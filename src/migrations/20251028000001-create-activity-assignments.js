'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activity_assignments', {
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
      worker_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      rol_en_actividad: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      assigned_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      unassigned_at: {
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

    // Índice compuesto para evitar duplicados activos
    await queryInterface.addIndex('activity_assignments', 
      ['activity_id', 'worker_id', 'unassigned_at'],
      {
        name: 'idx_activity_assignments_active'
      }
    );

    // Índice compuesto activity_id, worker_id
    await queryInterface.addIndex('activity_assignments',
      ['activity_id', 'worker_id'],
      {
        name: 'idx_activity_worker'
      }
    );

    // Índice por worker_id
    await queryInterface.addIndex('activity_assignments',
      ['worker_id'],
      {
        name: 'idx_worker'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('activity_assignments');
  }
};