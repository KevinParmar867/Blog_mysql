'use strict';
import { Model } from 'sequelize';
import { DataTypes } from 'sequelize'; // Import DataTypes separately

export default (sequelize) => { // Pass sequelize as a parameter
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: 'userID' });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'user',
    }
  );
  return User;
};
