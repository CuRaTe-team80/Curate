const mongoose = require('mongoose');
const dns = require('dns');

// Force Node to use public DNS resolvers for this lookup.
// Some Windows/managed-network DNS setups return SRV records in a way
// that Node's built-in resolver (c-ares) fails on with
// "querySrv ECONNREFUSED", even though the OS resolver (used by
// nslookup, Compass, etc.) handles the same lookup correctly.
dns.setServers(['8.8.8.8', '1.1.1.1']);

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/curate';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected:', uri);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
