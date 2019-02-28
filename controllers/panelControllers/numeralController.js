'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

//Добавить новость
router.post('/setNewNumeral', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const numeral = db.collection("NUMERAL");

			if(err) return console.log(err);

			numeral.find().toArray(function(err, results_numeral){
				var newAI = results_numeral.length + 1;
				var DATA = req.body;
				DATA.AI = newAI;
				DATA.AUTHOR = req.session.poziv; 
				numeral.insertOne(DATA);	
				res.send({code: 500, className: 'nSuccess', message: 'Цифра успешно добавлена!'});				
			});		
		});		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

module.exports = router;