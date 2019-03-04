'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const fs = require('fs');
router.use(cookieParser());

router.get('/', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
			const db = client.db(global.baseName);
			const conf = db.collection("CONFIG");
			const reviews = db.collection("REVIEWS");
						
			reviews.find({new: true}).sort({AI: -1}).toArray(function(err, result_reviews){
				fs.readFile('./settings.json', 'utf8', function(err, settings_file) {
					var params = JSON.parse(settings_file);
				   	conf.find().toArray(function(err, resultDB){
						res.render('panel/DB_panel.ejs',
						{
							sessionUser: req.session.user,
							sessionPoziv: req.session.poziv,
							isAdm: req.session.admin,
							locator: resultDB[0].LOCATOR,
							aboutData: resultDB,
							PARAMS: params,
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
