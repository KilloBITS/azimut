'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/*', function(req, res, next) {
  if(req.session.user !== undefined){
    var getNews = req.url.split('=')[1]; 
    mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
      const db = client.db(global.baseName);
      const user = db.collection("USERS");
      const tovar = db.collection("MARKET");
      const conf = db.collection("CONFIG");
      const msg = db.collection("MESSAGE");

      user.find({pozivnoy: req.session.poziv}).toArray(function(err, resUser){       
        conf.find().toArray(function(err, resultDB){
          if((resUser.length > 0) || (resUser[0].pozivnoy === req.session.poziv)){
            tovar.find({User: resUser[0].pozivnoy}).sort({AI: -1}).toArray(function(err, resTov){  
          //парссинг друзей
          var usersFriendArray = [];
          user.find().toArray(function(err, friends ){
            for(var f = 0; f < friends.length; f++){
              for(var f2 = 0; f2 < resUser[0].friend.length; f2++ ){
                if((friends[f].pozivnoy).indexOf(resUser[0].friend[f2]) >= 0){
                  usersFriendArray.push(friends[f]);    
                }
              }              
            }


              res.render('profile.ejs',
              {
               USER: resUser[0],
               tovar: resTov,
               sessionUser: req.session.user,
               sessionPoziv: req.session.poziv,
               isAdm: req.session.admin,
               locator: resultDB[0].LOCATOR,
               FRIEND: usersFriendArray
             }); 
         
            

          });
        }); 
          }else{
            res.redirect('/')
          }        
        }); 
      });   
    });  
  }else{
    res.redirect('/')
  }
  
});

module.exports = router;
