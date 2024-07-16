'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FriendsModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  };
  FriendsModel.init({
    user1_ID: DataTypes.INTEGER,
    user2_ID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FriendsModel',
  });

  return FriendsModel;
};