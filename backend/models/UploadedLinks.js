const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UpdatedLink = sequelize.define('UpdatedLink', {
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
  linkedinLinkRemark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cleanLinkedinLink: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'updated_links',  // Make sure the table name matches
  timestamps: false,
});

module.exports = UpdatedLink;
