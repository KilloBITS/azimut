'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bParser = require('body-parser');
const fs = require('fs');

router.use(cookieParser());

router.post('/addPhotoGallery', function(req, res, next){
	if(req.session.admin){
		var dir = './public/data/gallery/';

		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}

		var base64Data = req.body.a.replace(/^data:image\/(png|gif|jpeg|jpg);base64,/,'');


		var currentdate = new Date(); 
				var datetime = currentdate.getDate() + "-"
				+ (currentdate.getMonth()+1)  + "-" 
				+ currentdate.getFullYear() + "-"  
				+ currentdate.getHours() + "-"  
				+ currentdate.getMinutes() + "-" 
				+ currentdate.getSeconds();


		fs.writeFile(dir + datetime + ".jpg", base64Data, 'base64', function(err) {
			res.send({code: 500, className: 'nSuccess', message: 'Изображение успешно добавленно!'});	
		});			
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

router.post('/removedPhotoGallery', function(req, res, next){
	if(req.session.admin){
		var dir = './public/data/gallery/';	
	   	fs.unlink(dir + req.body.a, function(err){
	        if(err) return console.log(err);
	        res.send({code: 500, className: 'nSuccess', message: 'Изображение успешно удалено!'});		
	   	}); 		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});


module.exports = router;
