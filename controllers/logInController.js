'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/signin', function(req, res, next){
	if (!req.body.login || !req.body.password) {
		res.send({code:450, message: 'Неверный логин или пароль!'});
	}else{		
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const users = db.collection("USERS");

			if(err) return console.log(err);
			users.find({pozivnoy: req.body.login}).toArray(function(err, results_users){				
				if((results_users.length !== 0) && (req.body.login === results_users[0].pozivnoy && req.body.password === results_users[0].password)) {
					if(results_users[0].activity){
						if(!results_users[0].blocked){
							req.session.user = results_users[0].name;
							req.session.email = results_users[0].email;
							req.session.nick = results_users[0].nick;
							req.session.poziv = results_users[0].pozivnoy;
							req.session.admin = results_users[0].isAdmin;
							global.online = global.online + 1;
							res.send({code:500, data: results_users});

							global.setLog(4, 'Авторизация пользователя', 'Авторизация: '+results_users[0], results_users[0].pozivnoy);
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
	}
});


router.post('/getUserAva', function(req, res, next){	
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const users = db.collection("USERS");
		const LOGS = db.collection("LOGS");
		if(err) return console.log(err);
		users.find({pozivnoy: req.body.user}).toArray(function(err, results_users){
			if(results_users.length > 0){
				res.send({ava: results_users[0].ava, name: results_users[0].name})
			}			
			
		});
	});	
});


module.exports = router;