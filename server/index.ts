const express = require('express');
const linkRoutes = require('./routes/link.ts');

const app = express();

const cors = require('cors');

require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use(linkRoutes);

const dbo = require('./db/conn.ts');

app.listen(port, async () => {
  await dbo.connectToServer(function (err: any) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
