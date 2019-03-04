'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
			const db = client.db(global.baseName);
			const conf = db.collection("CONFIG");
			const roundtables = db.collection("ROUNDTABLES");
			const reviews = db.collection("REVIEWS");
			reviews.find({new: true}).sort({AI: -1}).toArray(function(err, result_reviews){
				conf.find().toArray(function(err, resultDB){
					roundtables.find().toArray(function(err, result_roundtables){
						res.render('panel/roundtables_panel.ejs',
						{
							sessionUser: req.session.user,
							sessionPoziv: req.session.poziv,
							isAdm: req.session.admin,
							locator: resultDB[0].LOCATOR,
							rt: result_roundtables,
							message: result_reviews
						});  
					});   
				}); 
			});
  
		});  
	}else{
		res.redirect('/');
	}	
});

module.exports = router;
