'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/setParamsUser', function(req, res, next){
	if(req.session.user !== undefined){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const user = db.collection("USERS");

			if(err) return console.log(err);	
			var isTrueSet = (req.body.b === 'true');
			switch(parseInt(req.body.a)){
				case 1: user.update({ pozivnoy: req.session.poziv },{$set: {isOnline: isTrueSet}});break;
				case 2: user.update({ pozivnoy: req.session.poziv },{$set: {isPozivnoy: isTrueSet}});break;
				case 3: user.update({ pozivnoy: req.session.poziv },{$set: {isProfile: isTrueSet}});break;
				case 4: user.update({ pozivnoy: req.session.poziv },{$set: {isMessage: isTrueSet}});break;
				case 5: user.update({ pozivnoy: req.session.poziv },{$set: {isFriend: isTrueSet}});break;
				case 6:  user.update({ pozivnoy: req.session.poziv },{$set: {isSecurity: isTrueSet}});break;
			}

			res.send({code: 500})
		});
	}else{
		res.send({code: 403, message: 'У вас нет доступа!'})
	}
});

module.exports = router;
