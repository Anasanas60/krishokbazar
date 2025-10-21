const seedDatabase = require('./db/seed.js');
const { sequelize } = require('./db/connection.js');

async function runSeed() {
  try {
    // Drop all tables and recreate them
    await sequelize.drop();
    console.log('🗑️ Database tables dropped');

    // Sync all models (this recreates the tables)
    await sequelize.sync({ force: true });
    console.log('🗑️ Database reset completed');

    // Run the seed
    await seedDatabase();
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await sequelize.close();
  }
}

runSeed();
