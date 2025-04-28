const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('Crud', 'postgres', 'Admin', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Set to true if you want to see SQL queries in console
});

// Test the connection (optional but recommended)
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

// Export both sequelize instance and connectDB function
module.exports = { sequelize, connectDB };
