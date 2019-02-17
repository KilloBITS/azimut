'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/newComment', function(req, res, next){
	if(req.session.user !== undefined){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const comments = db.collection("COMMENTS");
			const LOGS = db.collection("LOGS");
			if(err) return console.log(err);

			comments.find().sort({AI:-1}).limit(1).toArray(function(err, resultat){
				if(resultat.length > 0){
					var NEXT_AI = resultat[0].AI + 1;
				} else{
					var NEXT_AI = 1;
				}

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
				
				var NEW_COMMENT = {};
				NEW_COMMENT.user = req.session.user;
				NEW_COMMENT.newsAI = req.headers.referer.split('ai=')[1];
				NEW_COMMENT.text = req.body.text;
				NEW_COMMENT.date = today;		
				NEW_COMMENT.AI = NEXT_AI;			
				comments.insertOne(NEW_COMMENT);

				res.send({code: 500, msg: 'Комментарий успешно добавлен!', data: NEW_COMMENT});	
			});			
		});
	}else{
		res.send({code: 403, message: 'У вас нет доступа!'})
	}
});

module.exports = router;
