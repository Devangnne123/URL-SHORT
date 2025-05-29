const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ExcelData = sequelize.define('ExcelData', {
  linkedin_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  person_name: DataTypes.STRING,
  mobile_number: DataTypes.STRING,
  mobile_number_2: DataTypes.STRING,
  person_location: DataTypes.STRING,
  linkedin_url: DataTypes.STRING,
}, {
  tableName: 'excel_data',
  timestamps: false,
});

module.exports = ExcelData;
