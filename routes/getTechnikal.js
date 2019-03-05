'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const pagination = require('pagination');

router.use(cookieParser());

router.get('/*', function(req, res, next){
	var page = req.url.split('page=')[1];
  if(parseInt(page) === 1){
    var otNews = 0;
    var doNews = 12;
  }else{
    var otNews = 12 * (parseInt(page)-1);
    var doNews = otNews + 12;
  }
  switch(req.cookies.AL){
    case 'ru': var numLang = 0 ;break;
    case 'ua': var numLang = 1 ;break;
    case 'en': var numLang = 2 ;break;
    default: var numLang = 0;
  }
  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const technical = db.collection("TECHNIKAL");
    const conf = db.collection("CONFIG");
    technical.find().sort({AI: -1}).toArray(function(err, restechnical){
      conf.find().toArray(function(err, resultDB){
        console.log(restechnical.length)
        var current_page = page;
        var paginator = new pagination.SearchPaginator({prelink: '/technikal?' , current: current_page, rowsPerPage: 12, totalResult: restechnical.length-1});
        var p = paginator.getPaginationData();

        res.render('technikal.ejs',
        {
          sessionUser: req.session.user,
          sessionPoziv: req.session.poziv,
          isAdm: req.session.admin,
          locator: resultDB[0].LOCATOR,
          TECH: restechnical.slice(otNews, doNews),
          offLength: restechnical.length,
          isPage: page,
          paginate: p,
          page: resultDB[0][global.parseLanguage(req)],
          numberLanguage: numLang
        });
      });      
    });		
  });  
});

module.exports = router;
