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

           news.find().sort({AI: -1}).toArray(function(err, resNews){
                res.render('news.ejs',
                {
                  NEWS: resNews,
                  sessionUser: req.session.user,
                  sessionPoziv: req.session.poziv,
                  isAdm: req.session.admin
              });
          });		
     });  
});

module.exports = router;
