'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

//бновление описание "о нас"
router.post('/saveAboutText', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const conf = db.collection("CONFIG");

			if(err) return console.log(err);	

			conf.find().toArray(function(err, res_conf){
				var about_data = res_conf[0];
				about_data[req.body.a].about.text = req.body.b;			
				console.log(about_data)

				conf.remove();
				conf.insertOne(about_data);
				res.send({code: 500, className: 'nSuccess', message: 'Успешно сохранено!'})
			});		
		});
		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

router.post('/setMapPoint', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const conf = db.collection("CONFIG");

			if(err) return console.log(err);	

			conf.find().toArray(function(err, res_conf){
				var config_data = res_conf[0];
				config_data.MAP_POINTS = req.body.a;

				conf.remove();
				conf.insertOne(config_data);
				res.send({code: 500, className: 'nSuccess', message: 'Успешно сохранено!'})
			});		
		});
		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

router.post('/removeMapPoint', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const conf = db.collection("CONFIG");

		if(err) return console.log(err);	

		conf.find().toArray(function(err, res_conf){
			var config_data = res_conf[0];
			config_data.MAP_POINTS.splice(parseInt(req.body.a), 1);
			conf.remove();
			conf.insertOne(config_data);
			res.send({code: 500, className: 'nSuccess', message: 'Успешно удалено!'})
		});		
	});
});

router.post('/getMapPoint', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const conf = db.collection("CONFIG");

		if(err) return console.log(err);	

		conf.find().toArray(function(err, res_conf){
			var config_data = res_conf[0];

			res.send({code: 500, className: 'nSuccess', data: config_data.MAP_POINTS})
		});		
	});
});

module.exports = router;
