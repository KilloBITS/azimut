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
			const reviews = db.collection("REVIEWS");
			const users = db.collection("USERS");
			
			users.find().toArray(function(err, result_users){
				reviews.find({new: true}).sort({AI: -1}).toArray(function(err, result_reviews){
					conf.find().toArray(function(err, resultDB){
						console.log(resultDB[0].CONTACTS_EMAIL)
						res.render('panel/contacts_panel.ejs',
						{
							sessionUser: req.session.user,
							sessionPoziv: req.session.poziv,
							isAdm: req.session.admin,
							locator: resultDB[0].LOCATOR,
							listContact: resultDB[0].RU.admins,
							C_EMAIL: resultDB[0].CONTACTS_EMAIL,
							CONTACTS_FORM: resultDB[0].CONTACTS_FORM_ACTIVE,
							message: result_reviews,
							userList: result_users
						});  
					});
				}); 
			});   
		});  
	}else{
		res.redirect('/');
	}	
});

module.exports = router;
