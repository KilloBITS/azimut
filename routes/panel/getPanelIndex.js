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
			const logs = db.collection("LOGS");

			conf.find().toArray(function(err, resultDB){
				logs.find().limit(10).toArray(function(err, resultLogs){
					res.render('panel/index_panel.ejs',
					{
						sessionUser: req.session.user,
						sessionPoziv: req.session.poziv,
						isAdm: req.session.admin,
						locator: resultDB[0].LOCATOR,
						logs: resultLogs
					});  

					global.setLog(3, 'Вход в админку', 'Пользователь: '+ req.session.poziv + ' вошел в панель администратора', req.session.poziv);
				});   
			});   
		});  
	}else{
		res.redirect('/');
	}	
});

module.exports = router;
