'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/newtovarautodata', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const users = db.collection("USERS");
		const LOGS = db.collection("LOGS");
		if(err) return console.log(err);
		users.find({pozivnoy: req.session.poziv}).toArray(function(err, results_users ){
			console.log(results_users)
			if(results_users.length > 0){
					res.send({code: 500, data: results_users[0]})
				}else{
					res.send({code: 450, message: 'Ошибка данных'})
				}
			});
	});


});

module.exports = router;
