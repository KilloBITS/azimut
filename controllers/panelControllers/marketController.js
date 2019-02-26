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

			if(err) return console.log(err);

			market.update({ AI: parseInt(req.body.a) },{$set: {status: 'good'}});		

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

			if(err) return console.log(err);

			market.update({ AI: parseInt(req.body.a) },{$set: {status: 'stop'}});		

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

			if(err) return console.log(err);
		
			market.remove({ AI: parseInt(req.body.a)});

			res.send({code: 500, className: 'nSuccess', message: 'Товар успешно удален!'});				
		});

		
		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

module.exports = router;
