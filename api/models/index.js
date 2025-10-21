const fs = require('fs');
const path = require('path');
const { sequelize } = require('../db/connection');

const models = {};

console.log('🔍 Loading models from directory:', __dirname);

// Read all model files
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    console.log(`📁 Attempting to load: ${file}`);
    try {
      const model = require(path.join(__dirname, file));
      const modelName = file.split('.')[0].replace('Model', '');

      // Handle OrderModel special case
      if (file === 'OrderModel.js' && model.Order && model.OrderItem) {
        models['Order'] = model.Order;
        models['OrderItem'] = model.OrderItem;
        console.log(`✅ Successfully loaded: Order and OrderItem`);
      } else {
        models[modelName] = model;
        console.log(`✅ Successfully loaded: ${modelName}`);
      }
    } catch (error) {
      console.error(`❌ FAILED to load ${file}:`, error.message);
      console.error('   Full error:', error);
    }
  });

console.log('📋 Loaded models:', Object.keys(models));

// Set up associations
console.log('🔗 Setting up model associations...');
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    console.log(`   - Setting associations for: ${modelName}`);
    try {
      models[modelName].associate(models);
      console.log(`   ✅ Successfully set associations for: ${modelName}`);
    } catch (error) {
      console.error(`   ❌ FAILED setting associations for ${modelName}:`, error.message);
      console.error('   Full association error:', error);
    }
  } else {
    console.log(`   - No associations for: ${modelName}`);
  }
});

models.sequelize = sequelize;

console.log('🎯 Model loading completed');
module.exports = models;
