'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserTranslations', {
      en: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
       ko: {
          allowNull: true,
          primaryKey: false,
          type: Sequelize.STRING, 
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
    await queryInterface.dropTable('UserTranslations');
  }
};