
'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

//Добавить новость
router.post('/addnewroundtables', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const roundtables = db.collection("ROUNDTABLES");

			if(err) return console.log(err);

			var roundNewData = req.body;					
			roundtables.insertOne(roundNewData);

			roundtables.find().toArray(function(err, results_round){
				res.send({code: 500, className: 'nSuccess', message: 'Информация была успешно добавлена!', data: results_round});	
			});									
				
		});		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

router.post('/removeRoundtables', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const roundtables = db.collection("ROUNDTABLES");

			if(err) return console.log(err);
			
			roundtables.remove({ name: req.body.a });

			roundtables.find().toArray(function(err, results_roundtables){
				res.send({code: 500, className: 'nSuccess', message: 'Информация была успешно удалена!', data: results_roundtables});	
			});	
		});		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

module.exports = router;