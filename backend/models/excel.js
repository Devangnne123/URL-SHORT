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
  // New Fields (Add if missing)
  mobile_numbers: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  person_names: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  person_locations: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  mobile_numbers_2: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  }
}, {
  tableName: 'links',
  timestamps: false,
});

module.exports = Link;
