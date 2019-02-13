'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/*', function(req, res, next){
	var getKey = req.url.split('akeyAct=')[1]; 
	mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
		const db = client.db(global.baseName);
		const users = db.collection("USERS");

		users.find({regLink: getKey}).toArray(function(err, resultDB){
			if(resultDB.length === 1){
				if(!resultDB[0].activity){
					users.update({regLink: getKey},{$set: {activity: true}});
					req.session.user = resultDB[0].name;
					req.session.email = resultDB[0].email;
					req.session.nick = resultDB[0].nick;
					req.session.poziv = resultDB[0].pozivnoy;
					req.session.admin = resultDB[0].isAdmin;
					global.online = global.online + 1;
					res.send('<h1>Ваш аккаунт успешно активирован</h1><br><small>Перенаправление на грувную через: <span id="timer">5</span></small><script>setInterval(function(){document.getElementById("timer").innerHTML = parseInt(document.getElementById("timer").innerHTML)-1; if(parseInt(document.getElementById("timer").innerHTML) === 0){window.location.href = "/";} },1000)</script>');
				}else{
					res.send('<h1>Ваш аккаунт уже активирован</h1><br><small>Перенаправление на грувную через: <span id="timer">5</span></small><script>setInterval(function(){document.getElementById("timer").innerHTML = parseInt(document.getElementById("timer").innerHTML)-1; if(parseInt(document.getElementById("timer").innerHTML) === 0){window.location.href = "/";} },1000)</script>');
				}				
			}else{
				res.send('<h1>Ошибка активации аккаунта</h1><br><small>Перенаправление на грувную через: <span id="timer">5</span></small><script>setInterval(function(){document.getElementById("timer").innerHTML = parseInt(document.getElementById("timer").innerHTML)-1; if(parseInt(document.getElementById("timer").innerHTML) === 0){window.location.href = "/";} },1000)</script>');
			}
		});   
	});  
});

module.exports = router;
