'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

//Добавить новость
router.post('/setNewCalendar', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const calendar = db.collection("CALENDAR");

			if(err) return console.log(err);

			calendar.find().sort({AI: -1}).limit(1).toArray(function(err, results_news){
				if(req.body.title.length < 3 || req.body.text.length < 5 || !isNaN(new Date(req.body.start))){
					var calendarNewData = req.body;
					calendarNewData.AI = parseInt(results_news[0].AI)+1;
					calendar.insertOne(calendarNewData);

					calendar.find().toArray(function(err, results_calendar_end){
						res.send({code: 500, className: 'nSuccess', message: 'Информация была успешно добавлена!', data: results_calendar_end});	
					});					
				}else{
					res.send({code: 450, className: 'nError', message: 'Неверные данные'})
				}							
			});		
		});		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

router.post('/setDeleteCalendar', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const calendar = db.collection("CALENDAR");

			if(err) return console.log(err);
			
			calendar.remove({ AI: parseInt(req.body.a)});

			calendar.find().toArray(function(err, results_calendar_end){
				res.send({code: 500, className: 'nSuccess', message: 'Информация была успешно удалена!', data: results_calendar_end});	
			});	
		});		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

module.exports = router;