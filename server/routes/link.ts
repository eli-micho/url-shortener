const express = require("express");
const { ObjectId } = require('mongodb');
const cryptojs = require('crypto-js');
const base62 = require('base62');

const linkRoutes = express.Router();

const dbo = require("../db/conn.ts");

linkRoutes.route("/link").get(function (req, res) {
 let db_connect = dbo.getDb("url_shortener");
 db_connect
   .collection("links")
   .find({})
   .toArray()
   .then((data) => {
     res.json(data);
   });
});

linkRoutes.route("/link/add").post(async function (req, response) {
  let db_connect = dbo.getDb();
  const { originalURL } = req.body;
  const hash = cryptojs.SHA256(originalURL).toString();
  const hashNum = parseInt(hash.substring(0, 12), 16);
  const shortCode = base62.encode(hashNum);
  const firstSixChars = shortCode.slice(0, 3);

  let collect = await db_connect.collection("links");
  let result;
  try {
    result = await collect.insertOne({
      originalURL,
      shortCode: firstSixChars,
      createdAt: new Date(),
    });
    response.send(result).status(204);
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: "Database insert failed" });
  }
});


 
module.exports = linkRoutes;