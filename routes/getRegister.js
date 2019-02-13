'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', function(req, res, next){
	if(req.session.user !== undefined){
		res.redirect('/');
	}else{
		res.render('register.ejs',
			{
				sessionUser: req.session.user,
				sessionPoziv: req.session.poziv,
				isAdm: req.session.admin
			});	
	}
	
});

module.exports = router;
