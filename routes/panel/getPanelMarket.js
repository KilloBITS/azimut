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
			const market = db.collection("MARKET");
			const reviews = db.collection("REVIEWS");
			reviews.find({new: true}).sort({AI: -1}).toArray(function(err, result_reviews){
				conf.find().toArray(function(err, resultDB){
					market.find({status:'moderation'}).toArray(function(err, result_moderation){
						market.find({status: 'good'}).toArray(function(err, result_good){
							market.find({status: 'stop'}).toArray(function(err, result_stop){
								res.render('panel/market_panel.ejs',
								{
									sessionUser: req.session.user,
									sessionPoziv: req.session.poziv,
									isAdm: req.session.admin,
									locator: resultDB[0].LOCATOR,
									rm: result_moderation,
									rg: result_good,
									rs: result_stop,
									message: result_reviews
								});  
							}); 
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
