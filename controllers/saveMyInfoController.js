'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/saveMyInfo', function(req, res, next){
	if(req.session.user !== undefined){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const user = db.collection("USERS");
			if(err) return console.log(err);	
			if(req.body.a === req.body.b){
				user.find({pozivnoy: req.session.poziv}).toArray(function(err, resUser){
					user.update({ pozivnoy: req.session.poziv },{$set: {name: req.body.name}});
					user.update({ pozivnoy: req.session.poziv },{$set: {email: req.body.email}});
					user.update({ pozivnoy: req.session.poziv },{$set: {phone_number: req.body.phone}});
					user.update({ pozivnoy: req.session.poziv },{$set: {text: req.body.text}});
					res.send({code: 500, className: 'nSuccess', message:'Данные успешно сохранены!'});					
				});		
			}else{
				res.send({code: 450, className: 'nError', message:'Произошла ошибка!'})
			}			
		});
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

module.exports = router;
