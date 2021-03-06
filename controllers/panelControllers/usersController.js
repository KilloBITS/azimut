'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/blockUser', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const users = db.collection("USERS");

			if(err) return console.log(err);	
			users.update({pozivnoy: req.body.a} ,{$set: {blocked:  (req.body.b === 'true') }});

			if((req.body.b === 'true')){
				res.send({code: 500, className: 'nSuccess', message: 'Пользователь заблокирован!'});
			}else{
				res.send({code: 500, className: 'nSuccess', message: 'Пользователь разблокирован!'});
			}
			
		});	
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

router.post('/deleteUser', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const users = db.collection("USERS");

			if(err) return console.log(err);	
			users.remove({pozivnoy: req.body.a});	
			res.send({code: 500, className: 'nSuccess', message: 'Успешно удален!'})
		});	
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

router.post('/setAdmUser', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const users = db.collection("USERS");

			if(err) return console.log(err);	

			users.update({pozivnoy: req.body.a} ,{$set: {isAdmin: (req.body.b === 'true') }});
			res.send({code: 500, className: 'nSuccess', message: 'Успешно сохранено!'})
		});	


	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});




module.exports = router;
