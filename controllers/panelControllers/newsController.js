'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

//Добавить новость
router.post('/setNewNews', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const news = db.collection("NEWS");

			if(err) return console.log(err);

			news.find().sort({AI: -1}).limit(1).toArray(function(err, results_news){
				var newAI = parseInt(results_news[0].AI) + 1;
				var DATA = req.body;
				DATA.AI = newAI;
				DATA.AUTHOR = req.session.poziv; 
				news.insertOne(DATA);	
				res.send({code: 500, className: 'nSuccess', message: 'Новость успешно добавлена!'});				
			});		
		});		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

router.post('/saveEditNews', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const news = db.collection("NEWS");

			if(err) return console.log(err);

			// news.find({AI: parseInt(req.body.a)}).limit(1).toArray(function(err, results_news){
				news.update({AI: parseInt(req.body.a)} ,{$set: req.body});
				res.send({code: 500, className: 'nSuccess', message: 'Новость успешно обновлена!'});				
			// });		
		});		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

//Удалить новость
router.post('/setRemoveNews', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const news = db.collection("NEWS");

			if(err) return console.log(err);
			news.remove({ AI: parseInt(req.body.a)});
			res.send({code: 500, className: 'nSuccess', message: 'Новость успешно Удалена!'});				
		});		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

module.exports = router;