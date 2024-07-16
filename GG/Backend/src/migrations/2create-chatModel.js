'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ChatModel', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
       senderId: {
          allowNull: false,
          primaryKey: false,
          type: Sequelize.INTEGER,
          references: {
              model: 'UserAccount',
              key: 'id'
          }
       },
        receiverId: {
            allowNull: false,
            primaryKey: false,
            type: Sequelize.INTEGER,
            references: {
                 model: 'UserAccount',
                 key: 'id'
            }
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ChatModel');
  }
};