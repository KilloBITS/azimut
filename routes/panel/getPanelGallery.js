'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const fs = require('fs');
const Folder = __dirname.replace(/routes/g, '').replace(/panel/g, '').slice(0, -1).slice(0, -1) + '/public/data/gallery/';

router.use(cookieParser());

router.get('/', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
			const db = client.db(global.baseName);
			const conf = db.collection("CONFIG");
			const reviews = db.collection("REVIEWS");
			
			reviews.find({new: true}).sort({AI: -1}).toArray(function(err, result_reviews){
				fs.readdir(Folder, (err, files) => {
					console.log(files)
					conf.find().toArray(function(err, resultDB){
						res.render('panel/gallery_panel.ejs',
						{
							sessionUser: req.session.user,
							sessionPoziv: req.session.poziv,
							isAdm: req.session.admin,
							locator: resultDB[0].LOCATOR,
							aboutData: resultDB[0],
							images: files,
							message: result_reviews
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
