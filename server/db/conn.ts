const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
});

let _db: undefined;

module.exports = {
  connectToServer: async function () {
    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }
    _db = client.db('url_shortener');
    return _db === undefined ? false : true;
  },
  getDb: function () {
    return _db;
  },
};
