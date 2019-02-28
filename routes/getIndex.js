'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', function(req, res, next){  
	mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const news = db.collection("NEWS");
    const conf = db.collection("CONFIG");

    news.find().sort({AI: -1}).toArray(function(err, resNews){
      conf.find().toArray(function(err, resultDB){
        res.render('index.ejs',
        {
          NEWS: resNews.slice(0, 3),
          sessionUser: req.session.user,
          sessionPoziv: req.session.poziv,
          isAdm: req.session.admin,
          locator: resultDB[0].LOCATOR,
          page: resultDB[0][global.parseLanguage(req)],
          newsLength: resNews.length
        });
      });      
    });		
  });  
});

module.exports = router;
