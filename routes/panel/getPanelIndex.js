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
			const reviews = db.collection("REVIEWS");
			const logs = db.collection("LOGS");

			reviews.find({new: true}).sort({AI: -1}).toArray(function(err, result_reviews){
				conf.find().toArray(function(err, resultDB){
					logs.find().limit(10).toArray(function(err, resultLogs){
						res.render('panel/index_panel.ejs',
						{
							sessionUser: req.session.user,
							sessionPoziv: req.session.poziv,
							isAdm: req.session.admin,
							locator: resultDB[0].LOCATOR,
							logs: resultLogs,
							message: result_reviews,
						});  

						global.setLog(3, 'Вход в админку', 'Пользователь: '+ req.session.poziv + ' вошел в панель администратора', req.session.poziv);
					});   
				});    
			});   
		});  
	}else{
		res.redirect('/');
	}	
});

module.exports = router;
