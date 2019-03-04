'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const pagination = require('pagination');

router.use(cookieParser());

router.get('/*', function(req, res, next){
	var page = req.url.split('page=')[1];
	if(parseInt(page) === 1){
		var otNews = 0;
		var doNews = 12;
	}else{
		var otNews = 12 * (parseInt(page)-1);
		var doNews = otNews + 12;
	}
	switch(req.cookies.AL){
		case 'ru': var numLang = 0 ;break;
		case 'ua': var numLang = 1 ;break;
		case 'en': var numLang = 2 ;break;
		default: var numLang = 0;
	}
	mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
		const db = client.db(global.baseName);
		const conf = db.collection("CONFIG");
		const others = db.collection("NEWS");
		conf.find().toArray(function(err, resultDB){
			others.find({type:"OTHERS"}).toArray(function(err, result_others){
				var current_page = page;
		        var paginator = new pagination.SearchPaginator({prelink: '/others?' , current: current_page, rowsPerPage: 12, totalResult: result_others.length-1});
		        var p = paginator.getPaginationData();
				res.render('others.ejs',
				{
					sessionUser: req.session.user,
					sessionPoziv: req.session.poziv,
					isAdm: req.session.admin,
					locator: resultDB[0].LOCATOR,
					page: resultDB[0][global.parseLanguage(req)],
					NEWS: result_others,
					numberLanguage: numLang,
					offLength: result_others.length,
					isPage: page,
					paginate: p
				});  
			});  
		});   
	});  	
});

module.exports = router;
