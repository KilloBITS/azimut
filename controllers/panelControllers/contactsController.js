'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/saveNewContacts', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const conf = db.collection("CONFIG");

		if(err) return console.log(err);	

		conf.find().toArray(function(err, res_conf){
			var config_data = res_conf[0];
			config_data.RU.admins.push(req.body.RU);
			config_data.UA.admins.push(req.body.UA);
			config_data.EN.admins.push(req.body.EN);
			conf.remove();
			conf.insertOne(config_data);

			// conf.find().toArray(function(err, res_conf2){
				res.send({code: 500, className: 'nSuccess', message: 'Новый контакт успешно добавлен'});
			// });
		});		
	});
});

router.post('/saveOldContacts', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const conf = db.collection("CONFIG");

		if(err) return console.log(err);	

		conf.find().toArray(function(err, res_conf){
			var config_data = res_conf[0];
			config_data.RU.admins[parseInt(req.body.a)] = req.body.RU;
			config_data.UA.admins[parseInt(req.body.a)] = req.body.UA;
			config_data.EN.admins[parseInt(req.body.a)] = req.body.EN;
			conf.remove();
			conf.insertOne(config_data);

			// conf.find().toArray(function(err, res_conf2){
				res.send({code: 500, className: 'nSuccess', message: 'Изменения успешно сохранены!'});
			// });	
		});		
	});
});


router.post('/removeContactsUser', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const conf = db.collection("CONFIG");

		if(err) return console.log(err);	

		conf.find().toArray(function(err, res_conf){
			var config_data = res_conf[0];
			config_data.RU.admins.splice(parseInt(req.body.a), 1);
			config_data.UA.admins.splice(parseInt(req.body.a), 1);
			config_data.EN.admins.splice(parseInt(req.body.a), 1);
			conf.remove();
			conf.insertOne(config_data);
			// conf.find().toArray(function(err, res_conf2){
				res.send({code: 500, className: 'nSuccess', message: 'Контакт успешно удален'});
			// });
		});		
	});
});

router.post('/editedContactsUser', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const conf = db.collection("CONFIG");

		if(err) return console.log(err);	

		conf.find().toArray(function(err, res_conf){
			res.send({
				code: 500, 
				className: 'nSuccess', 
				message: 'Данные успешно получены!', 
				data: {
					RU: res_conf[0].RU.admins[parseInt(req.body.a)],
					UA: res_conf[0].UA.admins[parseInt(req.body.a)],
					EN: res_conf[0].EN.admins[parseInt(req.body.a)]
				} 
			})
		});		
	});
});



module.exports = router;
