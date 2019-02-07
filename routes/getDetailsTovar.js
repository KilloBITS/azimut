'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/*', function(req, res, next) {
  var getNews = req.url.split('=')[1]; 
  console.log(req);

  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const news = db.collection("MARKET");

    news.find({AI: parseInt(getNews)}).toArray(function(err, resNews){
      res.render('getDetailsTovar.ejs',
      {
        TOVAR: resNews[0],
        sessionUser: req.session.user,
        isAdm: req.session.admin
      });
    });   
   });  
});

module.exports = router;
