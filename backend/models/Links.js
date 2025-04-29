// models/Link.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Link = sequelize.define('Link', {
  uniqueId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
  },
  
  totalLinks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  links: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  clean_links: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  remark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  matchedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  }
}, {
  tableName: 'links',
  timestamps: false,
});

module.exports = Link;
