'use strict';
import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class Post extends Model {
    static associate(db) {
      Post.belongsTo(db.User, { foreignKey: 'userID', as: 'user' });
    }
  }
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(100), // Define the length for the title field
        allowNull: false,
      },
      desc: {
        type: DataTypes.STRING(256), // Define the length for the desc field
        allowNull: false,
      },
      postImg: {
        type: DataTypes.STRING(256), // Define the length for the postImg field
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cat: {
        type: DataTypes.STRING(255), // Define the length for the cat field
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Post',
      tableName: 'posts', // Set the table name to 'posts'
    }
  );
  return Post;
};
