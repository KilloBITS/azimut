'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', function(req, res, next){
	mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
		const db = client.db(global.baseName);
		const conf = db.collection("CONFIG");
		const rt = db.collection("ROUNDTABLES");
		conf.find().toArray(function(err, resultDB){
			rt.find().toArray(function(err, resultRT){
				res.render('roundtables.ejs',
				{
					sessionUser: req.session.user,
					sessionPoziv: req.session.poziv,
					isAdm: req.session.admin,
					locator: resultDB[0].LOCATOR,
					RT: resultRT,
					page: resultDB[0][global.parseLanguage(req)]
				});	
			});  
		});   
	}); 
});

module.exports = router;
