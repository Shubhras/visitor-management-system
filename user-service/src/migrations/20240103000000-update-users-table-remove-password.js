'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users');

    // Remove password column if it exists from the old schema
    if (table.password) {
      await queryInterface.removeColumn('users', 'password');
    }

    // Add phone column for resident contact info
    if (!table.phone) {
      await queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: null,
        after: 'email',
      });
    }

    // Add unitNumber so admins can see which unit a resident belongs to
    if (!table.unitNumber) {
      await queryInterface.addColumn('users', 'unitNumber', {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null,
        after: 'phone',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.removeColumn('users', 'phone');
    await queryInterface.removeColumn('users', 'unitNumber');
  },
};