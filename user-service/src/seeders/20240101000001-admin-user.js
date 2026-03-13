'use strict';

const bcrypt = require('bcryptjs');

// Seed the same admin account into the user service database so both
// the auth service and user service have a consistent admin record.
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('123456', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'System Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@test.com' });
  },
};