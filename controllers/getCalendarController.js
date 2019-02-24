'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/getCalendar', function(req, res, next){
	mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
	    const db = client.db(global.baseName);
	    const calendar = db.collection("CALENDAR");
	    var fortedNews = [];
		calendar.find().toArray(function(err, calendar){			
			res.send({data: calendar});
		}); 
	});
});

module.exports = router;
