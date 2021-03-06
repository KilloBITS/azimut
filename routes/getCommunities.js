'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/*', function(req, res, next){
	mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
		const db = client.db(global.baseName);
		const conf = db.collection("CONFIG");
		const communities = db.collection("COMMUNITIES");
		conf.find().toArray(function(err, resultDB){
			communities.find().sort({AI: -1}).toArray(function(err, result_communities){
				res.render('communities.ejs',
				{
					sessionUser: req.session.user,
					sessionPoziv: req.session.poziv,
					isAdm: req.session.admin,
					locator: resultDB[0].LOCATOR,
					page: resultDB[0][global.parseLanguage(req)],
					NEWS: communities
				});  
			});  
		});   
	});  	
});

module.exports = router;
