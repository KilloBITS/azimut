'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
			const db = client.db(global.baseName);
			const conf = db.collection("CONFIG");
			const users = db.collection("USERS");

			conf.find().toArray(function(err, resultDB){
				users.find().toArray(function(err, resultUSERS){
					res.render('panel/users_panel.ejs',
					{
						sessionUser: req.session.user,
						sessionPoziv: req.session.poziv,
						isAdm: req.session.admin,
						locator: resultDB[0].LOCATOR,
						users: resultUSERS
					});  
				});   
			});   
		});  
	}else{
		res.redirect('/');
	}	
});

module.exports = router;
