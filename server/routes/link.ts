const express = require("express");
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const urlModel = new mongoose.Schema({
  originalURL: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Url = mongoose.model('links', urlModel);


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

linkRoutes.route("/link/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let link = {
    originalURL: req.body.originalURL,
    shortCode: req.body.shortCode,
  }
  db_connect.collection("links").insertOne(link, function(err, res) {
    if (err) throw err;
    response.json(res)
  })
})
 
module.exports = linkRoutes;