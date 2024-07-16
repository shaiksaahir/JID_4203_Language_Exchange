'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FriendsModel', {
      user1_ID: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
            model: 'UserProfile',
            key: 'id'
        }
      },
       user2_ID: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.INTEGER,
          references: {
              model: 'UserProfile',
              key: 'id'
          }
       },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FriendsModel');
  }
};