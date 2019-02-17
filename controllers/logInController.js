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
			const LOGS = db.collection("LOGS");
			if(err) return console.log(err);
			users.find({pozivnoy: req.body.login}).toArray(function(err, results_users){				
				if((results_users.length !== 0) && (req.body.login === results_users[0].pozivnoy && req.body.password === results_users[0].password)) {
					if(results_users[0].activity){
						req.session.user = results_users[0].name;
						req.session.email = results_users[0].email;
						req.session.nick = results_users[0].nick;
						req.session.poziv = results_users[0].pozivnoy;
						req.session.admin = results_users[0].isAdmin;
						global.online = global.online + 1;
						res.send({code:500, data: results_users});

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
						NEW_LOGS.type = 'Авторизация пользователя';
						NEW_LOGS.text = 'Авторизация: '+results_users[0];
						LOGS.insertOne(NEW_LOGS);
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

module.exports = router;
