const express = require("express");

// watchlistsdRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const watchlistsdRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the watchlists.
watchlistsdRoutes.route("/watchlists").get((req, res) => {
  let db_connect = dbo.getDb("user");
  db_connect
    .collection("watchlists")
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single watchlist by id
watchlistsdRoutes.route("/watchlists/:id").get((req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("watchlists").findOne(myquery, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// This section will help you create a new watchlist
watchlistsdRoutes.route("/watchlists/add").post((req, response) => {
  let db_connect = dbo.getDb();
  let myobj = {
    listName: req.body.listName,
    emoji: req.body.emoji,
    tickers: req.body.tickersInDatabase,
  };
  db_connect.collection("watchlists").insertOne(myobj, (err, res) => {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you  update a watchlist's name & emoji by id
watchlistsdRoutes.route("/update-watchlist/:id").post((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      listName: req.body.listName,
      emoji: req.body.emoji,
      // tickers: req.body.tickersInDatabase,
    },
  };
  db_connect
    .collection("watchlists")
    .updateOne(myquery, newvalues, (err, res) => {
      if (err) throw err;
      console.log("1 watch list updated");
      response.json(res);
    });
});

// This section will help you  update a watchlist's tickers by id
watchlistsdRoutes
  .route("/update-watchlist-tickers/:id")
  .post((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
      $set: {
        // listName: req.body.listName,
        // emoji: req.body.emoji,
        tickers: req.body.tickersInDatabase,
      },
    };
    db_connect
      .collection("watchlists")
      .updateOne(myquery, newvalues, (err, res) => {
        if (err) throw err;
        console.log("1 watch list updated");
        response.json(res);
      });
  });

// This section will help you delete a watchlist

watchlistsdRoutes.route("/delete-watchlist/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };

  db_connect.collection("watchlists").deleteOne(myquery, (err, obj) => {
    if (err) throw err;
    console.log("1 watch list deleted");
    response.json(obj);
  });
});

module.exports = watchlistsdRoutes;
