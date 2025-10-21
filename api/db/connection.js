const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'krishokbazar',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  storage: process.env.DB_DIALECT === 'sqlite' ? path.join(__dirname, 'krishokbazar.sqlite') : undefined,
  logging: false // Disable logging
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite Database Connected successfully.');
    
    // Load models
    const models = require('../models');
    // Sync database. By default do not force-drop existing data. To reset and reseed,
    // set FORCE_SYNC=true in env to force sync (useful for CI or explicit resets).
    const forceSync = process.env.FORCE_SYNC === 'true';
    console.log(`🔄 Syncing database (force=${forceSync})...`);
    try {
      await sequelize.sync({ force: forceSync });
      console.log('✅ Database synchronized successfully');

      // Optionally seed database when SEED_DB=true (run once when desired)
      if (process.env.SEED_DB === 'true') {
        try {
          console.log('🌱 SEED_DB=true — running seed script...');
          const seedDatabase = require('./seed');
          await seedDatabase();
          console.log('🌱 Seeding completed');
        } catch (seedError) {
          console.error('❌ Seeding failed:', seedError.message);
        }
      }
    } catch (syncError) {
      console.log('⚠️  Sync completed with warnings:', syncError.message);
      // Continue anyway
    }
    
    return true;
  } catch (error) {
    console.log('❌ Database setup failed:', error.message);
    return false;
  }
};

module.exports = { sequelize, connectDB };