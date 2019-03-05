'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');
const base64 = require('base-64');
const fs = require('fs');

router.use(cookieParser());

router.post('/signup', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const users = db.collection("USERS");
		const LOGS = db.collection("LOGS");
		if(err) return console.log(err);
		console.log(res)
		users.find({email: req.body.newEmail}).toArray(function(err, results_usersEmail ){
			if(results_usersEmail.length === 0){
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

				var bEnc = base64.encode('azimut_'+req.body.poziv+today);
				var mainData = req.body;
				var NEW_USER = {};
				NEW_USER.nick = req.body.email.split('@')[0],
				NEW_USER.name =  req.body.name,
				NEW_USER.email = req.body.email,
				NEW_USER.phone_number = req.body.phone_number,
				NEW_USER.secret = null,
				NEW_USER.password = req.body.password,
				NEW_USER.rank = 0,
				NEW_USER.stars = 0,
				NEW_USER.pozivnoy = req.body.poziv,
				NEW_USER.isAdmin = false,
				NEW_USER.ava = "default.gif";
				NEW_USER.regiter_date = today;
				NEW_USER.official = false;
				NEW_USER.regLink = bEnc;
				NEW_USER.activity = false;
				NEW_USER.onlineSession = false;
				NEW_USER.friend = ['SUPPORT'];

				NEW_USER.isOnline = true;
				NEW_USER.isPozivnoy = true;
				NEW_USER.isProfile = true;
				NEW_USER.isMessage = true;
				NEW_USER.isFriend = true;
				NEW_USER.isSecurity = false;				

				users.insertOne(NEW_USER);

				// //create folder
				// var dir = './publick/data/avatars/'+req.body.poziv;

				// if (!fs.existsSync(dir)){
				// 	fs.mkdirSync(dir);
				// }
				
				global.sendMail("Регистрация","Вы успешно зарегистрировались на сайте http://ur4wwr.org/ ерейдите по сысылке для активации аккаунта - http://ur4wwr.org/activate-accaunt?akeyAct="+bEnc, req.body.email);
				res.send({code: 500, data: NEW_USER});	

				global.setLog(4, 'Регистрация пользователя', 'Регистрация нового аккаунта: '+req.body.poziv, req.body.poziv);				
			}else{
				res.send({code: 450, message: 'Ошибка регистрации'});
			}
		});
	});
});

router.post('/setForgotPassword', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const users = db.collection("USERS");
		const LOGS = db.collection("LOGS");
		if(err) return console.log(err);
		console.log(res)
		users.find({email: req.body.poziv}).toArray(function(err, results_usersEmail ){
			if(results_usersEmail.length === 0){
				var NEWPASS = Math.random().toString(36).slice(-10);
				tovaruk.update({pozivnoy: req.body.poziv },{$set: {password: NEWPASS}});		
				res.send({code: 500, data: 'Пароль успешно изменен! Новый пароль выслан вам на електронную почту!'});	
				global.sendMail("Востановление пароля","Вы подали запросс на востановление пароля от аккаунта: "+req.body.poziv+" на сайте http://ur4wwr.org/ . мы сгенерировали вам новый пароль : <b style='color: red; font-size: 20px'>"+NEWPASS+"</b><br><br> Изменить свой пароль вы можете в личном кабиинете!<br><br><br>С уважением администрация ur4wwr.org");
				global.setLog(4, 'Регистрация пользователя', 'Регистрация нового аккаунта: '+req.body.poziv, req.body.poziv);				
			}else{
				res.send({code: 450, message: 'Ошибка регистрации'});
			}
		});
	});
});

module.exports = router;
