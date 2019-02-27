'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

//Подтвердить объявление
router.post('/setGoodTovar', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const market = db.collection("MARKET");
			const user = db.collection("USERS");

			if(err) return console.log(err);

			market.update({ AI: parseInt(req.body.a) },{$set: {status: 'good'}});	

			market.find({ AI: parseInt(req.body.a) }).toArray(function(err, resTovar){
				user.find({pozivnoy: resTovar[0].User}).toArray(function(err, resuser){
					global.sendMail("Уведомление","Ваше объявление '"+ resTovar[0].Title +"' было одобрено администрацией!", resuser[0].email);
				});	
			});
			

			res.send({code: 500, className: 'nSuccess', message: 'Объявление переведено в статус активного!'});				
		});
		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

//отклонить объявление
router.post('/setCancelTovar', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const market = db.collection("MARKET");
			const user = db.collection("USERS");

			if(err) return console.log(err);

			market.update({ AI: parseInt(req.body.a) },{$set: {status: 'stop'}});		

			market.find({ AI: parseInt(req.body.a) }).toArray(function(err, resTovar){
				user.find({pozivnoy: resTovar[0].User}).toArray(function(err, resuser){
					global.sendMail("Уведомление","Ваше объявление '"+ resTovar[0].Title +"' не прошло модерацию!", resuser[0].email);
				});	
			});

			res.send({code: 500, className: 'nSuccess', message: 'Объявление переведено в статус неактивного!'});				
		});
		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

//удалить объявление
router.post('/setRemoveTovar', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const market = db.collection("MARKET");
			const user = db.collection("USERS");

			if(err) return console.log(err);

			market.find({ AI: parseInt(req.body.a) }).toArray(function(err, resTovar){
				user.find({pozivnoy: resTovar[0].User}).toArray(function(err, resuser){
					global.sendMail("Уведомление","Ваше объявление '"+ resTovar[0].Title +"' было удалено администрацией!", resuser[0].email);
				});	
			});

			market.remove({ AI: parseInt(req.body.a)});

			res.send({code: 500, className: 'nSuccess', message: 'Товар успешно удален!'});				
		});

		
		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

module.exports = router;
