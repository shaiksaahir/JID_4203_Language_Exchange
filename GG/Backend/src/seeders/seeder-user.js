'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  return queryInterface.bulkInsert('Users', [{
        email: 'quyenpham@gmail.com',
        password: '123',
        phonenumber: '123456',
        firstName: 'Quyen',
        lastName: 'Pham',
        address: 'Atlanta',
        gender: 0, // 0 - F and 1 - M
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};