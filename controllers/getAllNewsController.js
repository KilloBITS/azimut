'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/getAllNews', function(req, res, next){
	mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
	    const db = client.db(global.baseName);
	    const news = db.collection("NEWS");
	    var fortedNews = [];
		news.find().sort({AI: -1}).toArray(function(err, resNews){
			for(var i = parseInt(req.body.a); i < req.body.b; i++){
				if(resNews[i] !== undefined){
					fortedNews.push(resNews[i]);
				}				
			}
			res.send({data: fortedNews});
		}); 
	});
});

module.exports = router;
