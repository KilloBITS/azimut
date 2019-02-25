'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', function(req, res, next){
	switch(req.cookies.AL){
		case 'RU': var lang = 'RU' ;break;
		case 'UA': var lang = 'UA' ;break;
		case 'EN': var lang = 'EN' ;break;
		default: var lang = 'EN'
	}
	mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
		const db = client.db(global.baseName);
		const conf = db.collection("CONFIG");
		conf.find().toArray(function(err, resultDB){
			res.render('contacts.ejs',
			{
				sessionUser: req.session.user,
				sessionPoziv: req.session.poziv,
				isAdm: req.session.admin,
				locator: resultDB[0].LOCATOR,
				page: resultDB[0][global.parseLanguage(req)]
			});  
		});   
	});  	
});

module.exports = router;
