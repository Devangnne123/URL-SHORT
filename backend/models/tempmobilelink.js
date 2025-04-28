const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Adjust with your database config

const TempMobileLink = sequelize.define('TempMobileLink', {
  uniqueId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  matchedLinks: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
}, {
  tableName: 'tempmobilelink',
  timestamps: false,
});

module.exports = TempMobileLink;
