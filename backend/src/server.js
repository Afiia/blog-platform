const mongoose = require('mongoose');
const config = require('./config');
const app = require('./app');
const { Post } = require('./models');
const { seed } = require('./seed');

(async () => {
  try {
    let uri = config.MONGO_URI;
    if (config.USE_MEMORY_DB === 'true') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      uri = (await MongoMemoryServer.create()).getUri('blogdb');
    }
    await mongoose.connect(uri);
    // A brand-new database gets sample posts so the site is never empty.
    if (config.AUTO_SEED === 'true' && (await Post.estimatedDocumentCount()) === 0) await seed();
    const server = app.listen(config.PORT, () => console.log(`API listening on :${config.PORT}`));
    const shutdown = () => server.close(async () => { await mongoose.disconnect(); process.exit(0); });
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (e) {
    console.error('Startup failed:', e.message);
    process.exit(1);
  }
})();
