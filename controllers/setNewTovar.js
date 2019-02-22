'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/newTovar', function(req, res, next){
	if(req.session.user !== undefined){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const market = db.collection("MARKET");
			const LOGS = db.collection("LOGS");
			if(err) return console.log(err);

			market.find().sort({AI:-1}).limit(1).toArray(function(err, resultat){
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
				
				var NEW_TOVAR = {};
				NEW_TOVAR.Title = '';
				NEW_TOVAR.Description = '';
				NEW_TOVAR.Number = '';
				NEW_TOVAR.Email = '';		
				NEW_TOVAR.Type = '';			
				NEW_TOVAR.User = '';			
				NEW_TOVAR.Date = today;			
				NEW_TOVAR.AI = NEXT_AI;			
				NEW_TOVAR.status = 'moderation';			
				market.insertOne(NEW_TOVAR);

				res.send({code: 500, msg: 'Ваше объявление отправленно на модерацию!'});	
			});			
		});
	}else{
		res.send({code: 403, message: 'Ошибка!'})
	}
});

module.exports = router;
