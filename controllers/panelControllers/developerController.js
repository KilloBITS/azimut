'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/developerMessage', function(req, res, next){

	res.send({code: 500, className: 'nSuccess', message: 'Сообщение успешно отправленно, в скром времени мы вам ответим!'});	
	global.sendMail(req.body.a, req.body.b + '\n\n[Проблемная страница: '+req.body.c+']', 'mr.kalinuk@gmail.com');										
	
});

module.exports = router;