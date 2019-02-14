'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/*', function(req, res, next) {
  var getNews = req.url.split('=')[1]; 
  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const user = db.collection("USERS");
    const tovar = db.collection("MARKET");
    const conf = db.collection("CONFIG");

    user.find({pozivnoy: req.session.poziv}).toArray(function(err, resUser){       
      conf.find().toArray(function(err, resultDB){
      	if((resUser.length > 0) || (resUser[0].pozivnoy === req.session.poziv)){
          tovar.find({User: resUser[0].pozivnoy}).sort({AI: -1}).toArray(function(err, resTov){     
            res.render('profile.ejs',
            {
             USER: resUser[0],
             tovar: resTov,
             sessionUser: req.session.user,
             sessionPoziv: req.session.poziv,
             isAdm: req.session.admin,
             locator: resultDB[0].LOCATOR
           });         
          }); 
        }else{
          res.redirect('/')
        }        
      }); 
    });   
  });  
});

module.exports = router;
