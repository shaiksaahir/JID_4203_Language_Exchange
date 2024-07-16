'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  return queryInterface.bulkInsert('UserAccount', [{
        email: 'quyenpham@gmail.com',
        password: '$2a$10$KvbmA/75HgY3xgne5tcxae3zqZrRxXE.z51zyYmknJZ.4Byl/csjW', //password: '123'
        firstName: 'Quyen',
        lastName: 'Pham',
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