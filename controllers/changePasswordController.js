'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/changePass', function(req, res, next){
	if(req.session.user !== undefined){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const user = db.collection("USERS");

			if(err) return console.log(err);	
			if(req.body.c === req.body.b){
				user.find({pozivnoy: req.session.poziv}).toArray(function(err, resUser){
					if(resUser[0].password === req.body.a){
						user.update({ pozivnoy: req.session.poziv },{$set: {password: req.body.c}});
						res.send({code: 500, className: 'nSuccess', message:'Пароль успешно изменен!'})
					}else{
						res.send({code: 450, className: 'nWarning', message:'Старый пароль введен неверно!'})
					}
				});		
			}else{
				res.send({code: 450, className: 'nError', message:'Пароли не совпадают!'})
			}			
		});
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

module.exports = router;
