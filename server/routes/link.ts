const express = require('express');
const { ObjectId } = require('mongodb');
const cryptojs = require('crypto-js');
const base62 = require('base62');

const linkRoutes = express.Router();

const dbo = require('../db/conn.ts');

/*Schema for reference
const urlSchema = {
  _id: ObjectId,
  originalURL: string,
  shortCode: string,
  createdAt: Date
}
*/

linkRoutes
  .route('/link')
  .get(function (req: any, res: { json: (arg0: any) => void }) {
    const db_connect = dbo.getDb('url_shortener');
    db_connect
      .collection('links')
      .find({})
      .toArray()
      .then((data: any) => {
        res.json(data);
      });
  });

linkRoutes
  .route('/link/add')
  .post(async function (
    req: { body: { originalURL: any } },
    response: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: { error: string }): void; new (): any };
      };
      send: (arg0: any) => {
        (): any;
        new (): any;
        status: { (arg0: number): void; new (): any };
      };
    }
  ) {
    const db_connect = dbo.getDb();
    const { originalURL } = req.body;

    if (!originalURL) {
      return response.status(400).json({ error: 'Empty input' });
    }

    //Algorithm to turn originalURL string to a hashed value, we turn it to an integer and encode it using base62
    const hash = cryptojs.SHA256(originalURL).toString();
    const hashNum = parseInt(hash.substring(0, 12), 16);
    const shortCode = base62.encode(hashNum);

    //this gives us 62^3 unique combinations which is more than enough for this exercise, in real life we can increase the num of chars
    // to ensure scalability for billions of unique codes
    const firstThreeChars = shortCode.slice(0, 3);

    let collect = await db_connect.collection('links');
    let result;

    try {
      result = await collect.insertOne({
        originalURL,
        shortCode: firstThreeChars,
        createdAt: new Date(),
      });
      response.send(result).status(204);
    } catch (err) {
      response.status(500).json({ error: 'Database insert failed' });
    }
  });

linkRoutes
  .route('/:shortCode')
  .get(async function (
    req: { params: { shortCode: any } },
    response: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: { error: string }): void; new (): any };
      };
      redirect: (arg0: any) => void;
    }
  ) {
    const db_connect = dbo.getDb();
    const { shortCode } = req.params;

    const collect = await db_connect.collection('links');
    const result = await collect.findOne({ shortCode });

    if (!result) {
      response.status(404).json({ error: 'Short code not found' });
    } else {
      response.redirect(result.originalURL);
    }
  });

module.exports = linkRoutes;
