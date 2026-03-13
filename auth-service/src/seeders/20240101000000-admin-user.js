'use strict';

const bcrypt = require('bcryptjs');

// This seeder creates the default admin account used to log into
// the React dashboard. Run this once after the migration.
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('123456', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'System Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@test.com' });
  },
};