'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Modificar la restricción de clave foránea para la tabla activities
    await queryInterface.changeColumn('activities', 'id_parcela', {
      type: Sequelize.INTEGER,
      allowNull: true, // Cambiado a true para permitir NULL
      references: {
        model: 'plots',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL' // Mantenemos SET NULL, pero ahora allowNull es true
    });

    // Modificar la restricción de clave foránea para la tabla resources
    await queryInterface.changeColumn('resources', 'id_parcela', {
      type: Sequelize.INTEGER,
      allowNull: true, // Cambiado a true para permitir NULL
      references: {
        model: 'plots',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL' // Cambiado a SET NULL para mantener consistencia
    });
  },

  async down (queryInterface, Sequelize) {
    // Revertir los cambios
    await queryInterface.changeColumn('activities', 'id_parcela', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'plots',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.changeColumn('resources', 'id_parcela', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'plots',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
