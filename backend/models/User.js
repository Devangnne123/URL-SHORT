const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Define User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users', // Table name in your database
  timestamps: false,  // If you don't have createdAt/updatedAt
});

module.exports = User;
