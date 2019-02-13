'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/*', function(req, res, next) {
  var getNews = req.url.split('=')[1]; 
  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const news = db.collection("MARKET");
    const conf = db.collection("CONFIG");

    news.find({AI: parseInt(getNews)}).toArray(function(err, resNews){       
      conf.find().toArray(function(err, resultDB){
        res.render('getDetailsTovar.ejs',
        {
          TOVAR: resNews[0],
          sessionUser: req.session.user,
          sessionPoziv: req.session.poziv,
          isAdm: req.session.admin,
          locator: resultDB[0].LOCATOR
        });  
      }); 
    });   
  });  
});

module.exports = router;
