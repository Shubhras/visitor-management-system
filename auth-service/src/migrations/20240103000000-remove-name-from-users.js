'use strict';

// The auth service no longer stores user names. Profile data including
// name and active status belongs to the user service. This migration
// removes the name column from auth_db to keep the two databases clean.
module.exports = {
  async up(queryInterface) {
    const tableDescription = await queryInterface.describeTable('users');

    // Only remove the column if it actually exists to make this migration
    // safe to run even if the column was never added.
    if (tableDescription.name) {
      await queryInterface.removeColumn('users', 'name');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'name', {
      type: Sequelize.STRING(100),
      allowNull: true,
      after: 'id',
    });
  },
};