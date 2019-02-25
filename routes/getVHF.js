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
    var otNews = 0;
    var doNews = 12;
  }else{
    var otNews = 12 * (parseInt(page)-1);
    var doNews = otNews + 12;
  }
  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const news = db.collection("NEWS");
    const conf = db.collection("CONFIG");
    news.find({type:"VHF"}).sort({AI: -1}).toArray(function(err, resNews){
      conf.find().toArray(function(err, resultDB){
        var current_page = page;
        var paginator = new pagination.SearchPaginator({prelink: '/VHF?' , current: current_page, rowsPerPage: 12, totalResult: resNews.length-1});
        var p = paginator.getPaginationData();
        res.render('VHF.ejs',
        {
          sessionUser: req.session.user,
          sessionPoziv: req.session.poziv,
          isAdm: req.session.admin,
          locator: resultDB[0].LOCATOR,
          NEWS: resNews.slice(otNews, doNews),
          offLength: resNews.length,
          isPage: page,
          paginate: p,
          page: resultDB[0][global.parseLanguage(req)]
        });
      });      
    });		
  });  
});

module.exports = router;
