'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');
const fs = require("fs");

router.use(cookieParser());

var updateAvaUser = (req, res, next) => {
	mongoClient.connect(global.baseIP, { useNewUrlParser: true } ,function(err, client){
		var db = client.db(global.baseName);
		var users = db.collection("USERS");

		if(err) return console.log(err);
		users.find({pozivnoy: req.session.poziv}).toArray(function(err, results){
			if(results[0] !== undefined){
				var dir = './public/data/avatars/'+req.session.poziv;

				if (!fs.existsSync(dir)){
					fs.mkdirSync(dir);
				}

				var currentdate = new Date(); 
				var datetime = currentdate.getDate() + "-"
				+ (currentdate.getMonth()+1)  + "-" 
				+ currentdate.getFullYear() + "-"  
				+ currentdate.getHours() + "-"  
				+ currentdate.getMinutes() + "-" 
				+ currentdate.getSeconds();

				var base64Data = req.body.newAva.replace(/^data:image\/(png|gif|jpeg|jpg);base64,/,'');
				fs.writeFile(dir + '/' + req.session.poziv+ datetime + ".jpg", base64Data, 'base64', function(err) {
					users.update({ pozivnoy: req.session.poziv },{$set: {ava: req.session.poziv + '/'+req.session.poziv + datetime + '.jpg'}});
					res.send({code:500, img: '../../../data/avatars/'+ req.session.poziv + '/' + req.session.poziv + datetime + '.jpg'});
				});

			}else{
				res.send({code:430})
			}
		});
	});
};

router.post('/updateAvaUser', updateAvaUser, function(req, res, next){});

module.exports = router;