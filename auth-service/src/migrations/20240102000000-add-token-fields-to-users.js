'use strict';

// This migration adds the refresh token and password reset fields
// to the existing users table in auth_db. These fields support
// the token refresh flow and the forgot password flow.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'refreshToken', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'role',
    });

    await queryInterface.addColumn('users', 'resetPasswordToken', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      after: 'refreshToken',
    });

    await queryInterface.addColumn('users', 'resetPasswordExpires', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
      after: 'resetPasswordToken',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'refreshToken');
    await queryInterface.removeColumn('users', 'resetPasswordToken');
    await queryInterface.removeColumn('users', 'resetPasswordExpires');
  },
};