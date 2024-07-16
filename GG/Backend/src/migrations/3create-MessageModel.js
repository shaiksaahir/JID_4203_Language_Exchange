'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MessageModel', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
       chatId: {
          allowNull: false,
          primaryKey: false,
          type: Sequelize.INTEGER,
          references: {
              model: 'ChatModel',
              key: 'id'
          }
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
        text: {
            type: Sequelize.STRING
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
  await queryInterface.dropTable('MessageModel');
  }
};