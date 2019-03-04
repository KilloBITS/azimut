'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const pagination = require('pagination');

router.use(cookieParser());

router.get('/*', function(req, res, next){
	if(req.session.admin){
		var page = req.url.split('page=')[1];
		if(parseInt(page) === 1){
			var otNews = 0;
			var doNews = 12;
		}else{
			var otNews = 12 * (parseInt(page)-1);
			var doNews = otNews + 12;
		}
		mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
			const db = client.db(global.baseName);
			const conf = db.collection("CONFIG");
			const others = db.collection("NEWS");
			const reviews = db.collection("REVIEWS");
			reviews.find({new: true}).sort({AI: -1}).toArray(function(err, result_reviews){
				conf.find().toArray(function(err, resultDB){
					others.find({type:"OTHERS"}).toArray(function(err, result_others){
						var current_page = page;
						var paginator = new pagination.SearchPaginator({prelink: '/PanelOthers?' , current: current_page, rowsPerPage: 12, totalResult: result_others.length-1});
						var p = paginator.getPaginationData();

						res.render('panel/others_panel.ejs',
						{
							sessionUser: req.session.user,
							sessionPoziv: req.session.poziv,
							isAdm: req.session.admin,
							locator: resultDB[0].LOCATOR,
							othersData: result_others.slice(otNews, doNews),
							offLength: result_others.length,
							isPage: page,
							paginate: p,
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
