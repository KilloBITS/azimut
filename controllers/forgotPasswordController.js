'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/getPassEmail', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const users = db.collection("USERS");
		if(err) return console.log(err);
		users.find({pozivnoy: req.body.b}).toArray(function(err, results_users){				
			if(results_users.length !== 0) {
				if(results_users[0].activity){
					if(!results_users[0].blocked){
						var newPass = Math.random().toString(36).slice(-8);	
						users.updateOne( { pozivnoy: req.body.b}, {$set:{ password: newPass } })						
						global.sendMail("Новый пароль","Вы успешно изменили пароль: "+newPass, results_users[0].email);					
						res.send({code:500, className: 'nWarning', message: 'Новый пароль отправлен вам на електронную почту!'});
					}else{
						res.send({code:450, className: 'nWarning', message: 'Ваш аккаунт заблокирован!'});
					}
				}else{
					res.send({code:450, className: 'nWarning', message: 'Аккаунт не активирован'});
				}
			}else{
				res.send({code:450, className: 'nError', message: 'Неверный логин или пароль!'});
			}
		});
	});	
});

router.post('/forgotemail', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const users = db.collection("USERS");
		if(err) return console.log(err);
		users.find({pozivnoy: req.body.aa}).toArray(function(err, results_users){				
			if(results_users.length !== 0) {
				if(results_users[0].activity){
					if(!results_users[0].blocked){								
						res.send({code:500, className: 'nWarning', message: 'Введите ваш email!', userData: results_users[0]});
					}else{
						res.send({code:450, className: 'nWarning', message: 'Ваш аккаунт заблокирован!'});
					}
				}else{
					res.send({code:450, className: 'nWarning', message: 'Аккаунт не активирован'});
				}
			}else{
				res.send({code:450, className: 'nError', message: 'Неверный логин или пароль!'});
			}
		});
	});	
});

router.post('/forgotsecret', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const users = db.collection("USERS");
		if(err) return console.log(err);
		users.find({pozivnoy: req.body.aa}).toArray(function(err, results_users){				
			if(results_users.length !== 0) {
				if(results_users[0].activity){
					if(!results_users[0].blocked){								
						res.send({code:500, className: 'nWarning', message: 'Введите ваше секретное слово!', userData: results_users[0]});
					}else{
						res.send({code:450, className: 'nWarning', message: 'Ваш аккаунт заблокирован!'});
					}
				}else{
					res.send({code:450, className: 'nWarning', message: 'Аккаунт не активирован'});
				}
			}else{
				res.send({code:450, className: 'nError', message: 'Неверный логин или пароль!'});
			}
		});
	});	
});

module.exports = router;