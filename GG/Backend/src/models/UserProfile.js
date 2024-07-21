'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here


    }
  };
  UserProfile.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    native_language: DataTypes.STRING,
    target_language: DataTypes.STRING,
    target_language_proficiency: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    profession: DataTypes.STRING,
    hobby: DataTypes.STRING,
    mbti: DataTypes.STRING,
    dates_available: DataTypes.STRING,
    times_available: DataTypes.STRING,
    visibility: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  return UserProfile;
};