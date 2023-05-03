const express = require("express");
const linkRoutes = require("./routes/link.ts")

const app = express();

const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use(linkRoutes);

// Get MongoDB driver connection
const dbo = require("./db/conn.ts");
 
app.listen(port, async () => {
  // Perform a database connection when server starts
  await dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});