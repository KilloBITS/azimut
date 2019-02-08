'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/newComment', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const comments = db.collection("COMMENTS");
		const LOGS = db.collection("LOGS");
		if(err) return console.log(err);

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();
		if(dd<10) {
			dd = '0'+dd
		}
		if(mm<10) {
			mm = '0'+mm
		}
		today = mm + '-' + dd + '-' + yyyy;

		var NEW_LOGS = {};
		NEW_LOGS.date = today;
		NEW_LOGS.type = 'Оставлен комментарий';
		NEW_LOGS.text = 'Пользователь оставил комментарий: '+
		LOGS.insertOne(NEW_LOGS);

		console.log(req);

		var NEW_COMMENT = {};
		NEW_COMMENT.user = req.session.user;
		NEW_COMMENT.newsAI = req.headers.referer.split('ai=')[1];
		NEW_COMMENT.text = req.body.text;
		NEW_COMMENT.date = today;					
		comments.insertOne(NEW_COMMENT);

		
		res.send({code: 500, data: 'Комментарий успешно добавлен!'});	
	});
});

module.exports = router;
