'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const fs = require('fs');
const Folder = __dirname.replace(/routes/g, '').slice(0, -1) + '/public/data/gallery/';
router.use(cookieParser());

router.get('/', function(req, res, next){
	mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
		const db = client.db(global.baseName);
		const conf = db.collection("CONFIG");

		conf.find().toArray(function(err, resultDB){			
			fs.readdir(Folder, (err, files) => {
				res.render('about.ejs',
				{
					sessionUser: req.session.user,
					sessionPoziv: req.session.poziv,
					isAdm: req.session.admin,
					locator: resultDB[0].LOCATOR,
					page: resultDB[0][global.parseLanguage(req)],
					images: files
				});  
			})   

			
		});   
	});  
});

module.exports = router;
