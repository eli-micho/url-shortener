const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient("mongodb+srv://EliFCC:pinkcowdog11@cluster0.ncglt.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
});
 
let _db;
 
module.exports = {
  connectToServer: async function (callback) {
    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }
    _db = client.db("url_shortener");
    return (_db === undefined ? false : true);
  
    /* client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db)
      {
        _db = db.db("sample_analytics");
        console.log("Successfully connected to MongoDB."); 
      }
      if(err){
        console.log(err)
      }
      
      return callback(err);
         }); */
  },
 
  getDb: function () {
    return _db;
  },
};