'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserAccount', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
       email: {
            type: Sequelize.STRING
       },
        password: {
            type: Sequelize.STRING
        },
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        loggedIn: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserAccount');
  }
};