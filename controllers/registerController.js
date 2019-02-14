'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');
const base64 = require('base-64');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'azimutbot@gmail.com',
        pass: 'qazwsx159357'
    }
});

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

					var NEW_LOGS = {};
					NEW_LOGS.date = today;
					NEW_LOGS.type = 'Новый пользователь';
					NEW_LOGS.text = 'Зарегистрирован новый пользователь: '+req.body.email.split('@')[0];
					LOGS.insertOne(NEW_LOGS);
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
					users.insertOne(NEW_USER);
;					
					res.send({code: 500, data: NEW_USER});

					let mailOptions = {
				        from: "azimutbot@gmail.com", // sender address
				        to: req.body.email, // list of receivers
				        subject: 'Регистрация', // Subject line
				        text:  "Вы успешно зарегистрировались на сайте http://ur4wwr.org/ ерейдите по сысылке для активации аккаунта - http://ur4wwr.org/activate-accaunt?akeyAct="+bEnc, // plain text body
				        // html: SHABLON_MESSAGE // html body
				    };
				  transporter.sendMail(mailOptions, function (error, info) {});
			}else{
				res.send({code: 450, message: 'Ошибка регистрации'})
			}
		});
	});


});

module.exports = router;
