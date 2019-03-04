'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/*', function(req, res, next) {
  var getNews = req.url.split('=')[1]; 
  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const news = db.collection("NEWS");
    const conf = db.collection("CONFIG");
    const reviews = db.collection("REVIEWS");
    reviews.find({new: true}).sort({AI: -1}).toArray(function(err, result_reviews){
      news.find({AI: parseInt(getNews)}).toArray(function(err, resNews){
        conf.find().toArray(function(err, resultDB){
          console.log(resNews)
          res.render('panel/editNewsPanel.ejs',
          {
            NEWS: resNews[0],
            sessionUser: req.session.user,
            sessionPoziv: req.session.poziv,
            isAdm: req.session.admin,
            locator: resultDB[0].LOCATOR,
            message: result_reviews
          });
        });       
      });   
    });
   
  });  
});

module.exports = router;
