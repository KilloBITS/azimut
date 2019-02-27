'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const pagination = require('pagination');

router.use(cookieParser());

router.get('/', function(req, res, next){
  var page = req.url.split('page=')[1];
  if(parseInt(page) === 1){
    var otTov = 0;
    var doTov = 12;
  }else{
    var otTov = 12 * (parseInt(page)-1);
    var doTov = otTov + 12;
  }
	mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const market = db.collection("MARKET");
    const conf = db.collection("CONFIG");
    market.find({status: 'good'}).sort({AI: -1}).toArray(function(err, resTov){     
      var current_page = page;
      var paginator = new pagination.SearchPaginator({prelink: '/market?' , current: current_page, rowsPerPage: 12, totalResult: resTov.length-1});
      var p = paginator.getPaginationData();

      conf.find().toArray(function(err, resultDB){
        res.render('flea_market.ejs',
        {
          TOVAR: resTov.slice(otTov, doTov),
          sessionUser: req.session.user,
          sessionPoziv: req.session.poziv,
          isAdm: req.session.admin,
          locator: resultDB[0].LOCATOR,
          page: resultDB[0][global.parseLanguage(req)],
          offLength: resTov.length,
          isPage: page,
          paginate: p
        });  
      });         
    });		
  });  
});

module.exports = router;
