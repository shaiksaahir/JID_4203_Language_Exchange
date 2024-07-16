'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  };
  ChatModel.init({
    senderId: DataTypes.STRING,
    receiverId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ChatModel',
  });

  return ChatModel;
};