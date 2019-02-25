'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const pagination = require('pagination');

router.use(cookieParser());

router.get('/', function(req, res, next){
  switch(req.cookies.AL){
    case 'RU': var lang = 'RU' ;break;
    case 'UA': var lang = 'UA' ;break;
    case 'EN': var lang = 'EN' ;break;
    default: var lang = 'EN'
  }
	mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const market = db.collection("MARKET");
    const conf = db.collection("CONFIG");
    market.find({status: 'good'}).sort({AI: -1}).toArray(function(err, resTov){     
      conf.find().toArray(function(err, resultDB){
        res.render('flea_market.ejs',
        {
          TOVAR: resTov,
          sessionUser: req.session.user,
          sessionPoziv: req.session.poziv,
          isAdm: req.session.admin,
          locator: resultDB[0].LOCATOR,
          page: resultDB[0][global.parseLanguage(req)]
        });  
      });         
    });		
  });  
});

module.exports = router;
