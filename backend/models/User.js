const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const crypto = require('crypto');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  key: {
    type: DataTypes.STRING(12),
    allowNull: true,
    unique: true,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Method to generate and set a 12-character key
User.prototype.generateKey = function () {
  const newKey = crypto.randomBytes(6).toString('hex'); // 12 characters
  this.key = newKey;
  return this.key;
};

// Hook to generate key before user creation
User.beforeCreate((user) => {
  if (!user.key) {
    user.generateKey();
  }
});

// Regenerate key if email is changed
User.beforeUpdate((user) => {
  if (user.changed('email')) {
    user.generateKey();
  }
});

module.exports = User;
