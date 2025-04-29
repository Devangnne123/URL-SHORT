// models/TempMobileLink.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

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
  mobile_numbers: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  person_names: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  person_locations: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  mobile_numbers_2: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
}, {
  tableName: 'tempmobilelink',
  timestamps: false,
});

module.exports = TempMobileLink;
