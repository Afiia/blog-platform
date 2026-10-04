const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

(async () => {
  const dbPath = path.join(__dirname, '..', '.data');
  fs.mkdirSync(dbPath, { recursive: true });
  const mongod = await MongoMemoryServer.create({ instance: { port: 27017, dbPath, storageEngine: 'wiredTiger' } });
  console.log('Local MongoDB running at', mongod.getUri());
  process.on('SIGINT', async () => { await mongod.stop(); process.exit(0); });
})();
