/**
 * Database initialization and migration script for URL Shortener Service
 * Run this script to set up the database with proper indexes and collections.
 */

const mongoose = require('mongoose');
const Url = require('../models/Url');
require('dotenv').config();

async function initializeDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    console.log('🏗️  Creating indexes...');

    // Create indexes for the Url collection
    await Url.collection.createIndex({ shortId: 1 }, { unique: true });
    console.log('✅ Created unique index on shortId');

    await Url.collection.createIndex({ createdAt: -1 });
    console.log('✅ Created index on createdAt');

    await Url.collection.createIndex({ shardKey: 1 });
    console.log('✅ Created index on shardKey');

    await Url.collection.createIndex({ clickCount: -1 });
    console.log('✅ Created index on clickCount');

    // Create compound indexes for analytics queries
    await Url.collection.createIndex({ 
      shardKey: 1, 
      createdAt: -1 
    });
    console.log('✅ Created compound index on shardKey + createdAt');

    console.log('📊 Database statistics:');
    const stats = await Url.collection.stats();
    console.log(`   - Collection: ${stats.ns}`);
    console.log(`   - Documents: ${stats.count}`);
    console.log(`   - Indexes: ${stats.nindexes}`);
    console.log(`   - Size: ${(stats.size / 1024).toFixed(2)} KB`);

    // Insert a test document if collection is empty
    const count = await Url.countDocuments();
    if (count === 0) {
      console.log('📝 Inserting test document...');
      const testUrl = new Url({
        shortId: 'test1234',
        originalUrl: 'https://www.example.com',
        clickCount: 0,
        referrers: new Map([['direct', 1], ['google.com', 2]]),
        createdAt: new Date()
      });
      await testUrl.save();
      console.log('✅ Test document created');
    }

    console.log('🎉 Database initialization completed successfully!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Enable sharding preparation (for future use)
async function enableSharding() {
  try {
    console.log('🔧 Preparing for sharding...');

    // This would be run on a sharded MongoDB cluster
    // For local development, this is informational
    console.log('ℹ️  To enable sharding in production:');
    console.log('   1. sh.enableSharding("urlshortener")');
    console.log('   2. sh.shardCollection("urlshortener.urls", { "shardKey": 1 })');
    console.log('   3. Configure balancer settings');

  } catch (error) {
    console.log('ℹ️  Sharding setup skipped (requires sharded cluster)');
  }
}

// Performance optimization suggestions
function displayOptimizationTips() {
  console.log('\n🚀 Performance Optimization Tips:');
  console.log('   1. Enable MongoDB WiredTiger cache');
  console.log('   2. Configure connection pooling (default: 100)');
  console.log('   3. Use read preferences for analytics queries');
  console.log('   4. Consider Redis for caching hot URLs');
  console.log('   5. Monitor slow queries with db.setProfilingLevel(2)');
  console.log('');
  console.log('🔍 Monitoring Commands:');
  console.log('   - db.urls.getIndexes()');
  console.log('   - db.urls.stats()');
  console.log('   - db.runCommand({collStats: "urls"})');
}

// Main execution
async function main() {
  console.log('🚀 URL Shortener Database Migration');
  console.log('=====================================\n');

  await initializeDatabase();
  await enableSharding();
  displayOptimizationTips();

  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
}

module.exports = { initializeDatabase, enableSharding };
