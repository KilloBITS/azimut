'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/userMessagePost', function(req, res, next){
	// global.sendMail("Обратная связь", req.body.msg + '\n\n  Мой email для ответа  - ' + req.body.user + ' ('+req.body.name+')', 'azimutbot@gmail.com');
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const reviews = db.collection("REVIEWS");

		if(err) return console.log(err);

		reviews.find().toArray(function(err, results_rev){
			var newRev = {};
			newRev.msg = req.body.msg;
			newRev.user = req.body.user;
			newRev.name = req.body.name;
			newRev.AI = results_rev.length+1;
			newRev.new = true;
			reviews.insertOne(newRev);	
			res.send({code: 500, className: 'nSuccess', message: 'Сообщение успешно отправленно, в скром времени мы вам ответим!'});	
			global.sendMail("Получено новое сообщение от пользователя","Получено новое сообщение от пользователя " + req.body.user,  'mr.kalinuk@gmail.com');										
		});		
	});		
});

module.exports = router;