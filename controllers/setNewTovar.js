'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');
const fs = require('fs');

router.use(cookieParser());

router.post('/newTovar', function(req, res, next){
	if(req.session.user !== undefined){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const market = db.collection("MARKET");
			const LOGS = db.collection("LOGS");
			if(err) return console.log(err);

			market.find().sort({AI:-1}).limit(1).toArray(function(err, resultat){
				if(resultat.length > 0){
					var NEXT_AI = resultat[0].AI + 1;
				} else{
					var NEXT_AI = 1;
				}

				var currentdate = new Date(); 
				var datetime = currentdate.getDate() + "-"
				+ (currentdate.getMonth()+1)  + "-" 
				+ currentdate.getFullYear() + "-"  
				+ currentdate.getHours() + "-"  
				+ currentdate.getMinutes() + "-" 
				+ currentdate.getSeconds();
	
				
				var NEW_TOVAR = {};
				NEW_TOVAR.Title = req.body.info[0];
				NEW_TOVAR.Description = req.body.info[3];
				NEW_TOVAR.Number = req.body.info[1];
				NEW_TOVAR.Email = req.body.info[2];		
				NEW_TOVAR.Type = req.body.type;			
				NEW_TOVAR.User = req.session.poziv;			
				NEW_TOVAR.Date = datetime;			
				NEW_TOVAR.AI = NEXT_AI;			
				NEW_TOVAR.status = 'moderation';
				if(req.body.type !== 'Отдам'){
					NEW_TOVAR.Price = req.body.info[4];
				}				
				NEW_TOVAR.Images = [];

				if(req.body.image !== undefined && req.body.image.length > 0){
					var dir = './public/data/tovar/'+NEXT_AI;

					if (!fs.existsSync(dir)){
						fs.mkdirSync(dir);
					}
					var forImage = [];
					for(let i = 0; i < req.body.image.length; i++){
						console.log(i);
						forImage.push("/"+NEXT_AI+"/"+i+".jpg");
				    	var base64Data = req.body.image[i].replace(/^data:image\/(png|gif|jpeg|jpg);base64,/,'');
			    		require("fs").writeFile(dir + "/"+i+".jpg", base64Data, 'base64', function(err) {
			    			forImage.push("/"+i+".jpg");
				    	});
				   	}
				   	NEW_TOVAR.Images = forImage;
				}
				
				
				market.insertOne(NEW_TOVAR);
				res.send({code: 500, className:'nSuccess', message: 'Ваше объявление отправленно на модерацию!'});
				global.setLog(3, 'Добавление товара', 'Подача объявления на барахолке: '+req.session.poziv, req.session.poziv);		
			});			
		});
	}else{
		res.send({code: 403, className:'nError', message: 'Ошибка!'})
	}
});

module.exports = router;
