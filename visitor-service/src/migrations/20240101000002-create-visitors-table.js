'use strict';

// This migration creates the visitors table that stores all visitor
// requests submitted by residents through the mobile app.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('visitors', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      unitNumber: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      visitDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      // We store the user ID so residents only see their own visitors
      // and admins can see who registered each visitor.
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Index on status so filtering pending visitors stays fast
    // as the visitors table grows over time.
    await queryInterface.addIndex('visitors', ['status'], {
      name: 'visitors_status_index',
    });

    // Index on createdBy so resident-specific queries are efficient.
    await queryInterface.addIndex('visitors', ['createdBy'], {
      name: 'visitors_created_by_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('visitors');
  },
};