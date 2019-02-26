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
    const act = db.collection("ACTIVITY");
    const conf = db.collection("CONFIG");
    act.find().sort({AI: -1}).toArray(function(err, resAct){
      conf.find().toArray(function(err, resultDB){
        var current_page = page;
        var paginator = new pagination.SearchPaginator({prelink: '/act?' , current: current_page, rowsPerPage: 12, totalResult: resAct.length-1});
        var p = paginator.getPaginationData();

        res.render('activity.ejs',
        {
          sessionUser: req.session.user,
          sessionPoziv: req.session.poziv,
          isAdm: req.session.admin,
          locator: resultDB[0].LOCATOR,
          NEWS: resAct.slice(otNews, doNews),
          offLength: resAct.length,
          isPage: page,
          paginate: p,
          page: resultDB[0][global.parseLanguage(req)]
        });
      });      
    });   
  });  
});

module.exports = router;
