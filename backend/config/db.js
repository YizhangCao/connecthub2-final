const { MongoClient } = require('mongodb');

let db = null;
let client = null;

async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/connecthub';
    client = new MongoClient(uri);
    
    await client.connect();
    console.log('MongoDB connected successfully');
    
    db = client.db();
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
  }
}

module.exports = { connectDB, getDB, closeDB };