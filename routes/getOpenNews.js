'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/*', function(req, res, next) {
  var getNews = req.url.split('=')[1]; 
  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const news = db.collection("NEWS");
    const comments = db.collection("COMMENTS");

    news.find({AI: parseInt(getNews)}).toArray(function(err, resNews){
      comments.find({newsAI: getNews}).sort({AI: -1}).toArray(function(err, resComment){
        res.render('openNews.ejs',
        {
          NEWS: resNews[0],
          COMMENTS: resComment,
          sessionUser: req.session.user,
          sessionPoziv: req.session.poziv,
          isAdm: req.session.admin
        });
      });    
    });   
   });  
});

module.exports = router;
