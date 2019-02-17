'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/opendialog*', function(req, res, next){
	if(req.session.user !== undefined){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const msg = db.collection("MESSAGE");

			if(err) return console.log(err);

			msg.find({to: { $in: [ req.session.poziv, req.body.user ]}, do: { $in: [ req.session.poziv, req.body.user ]} }).sort({AI: 1}).limit(20).toArray(function(err, resDlg){	
				res.send({code: 500, data: resDlg});	
			});		
		});
	}else{
		res.send({code: 403, message: 'У вас нет доступа!'})
	}
});

module.exports = router;
