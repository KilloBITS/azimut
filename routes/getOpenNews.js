'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/*', function(req, res, next) {
  var getNews = req.url.split('=')[1]; 
  switch(req.cookies.AL){
    case 'ru': var numLang = 0 ;break;
    case 'ua': var numLang = 1 ;break;
    case 'en': var numLang = 2 ;break;
    default: var numLang = 0;
  }
  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const news = db.collection("NEWS");
    const comments = db.collection("COMMENTS");
    const conf = db.collection("CONFIG");

    news.find({AI: parseInt(getNews)}).toArray(function(err, resNews){
      comments.find({newsAI: getNews}).sort({AI: -1}).toArray(function(err, resComment){
        conf.find().toArray(function(err, resultDB){
          res.render('openNews.ejs',
          {
            NEWS: resNews[0],
            COMMENTS: resComment,
            sessionUser: req.session.user,
            sessionPoziv: req.session.poziv,
            isAdm: req.session.admin,
            locator: resultDB[0].LOCATOR,
            page: resultDB[0][global.parseLanguage(req)],
            numberLanguage: numLang
          });
        });        
      });    
    });   
  });  
});

module.exports = router;
