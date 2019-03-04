'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bParser = require('body-parser');
const fs = require('fs');
const Folder = __dirname.replace(/routes/g, '').replace(/panelController/g, '').replace(/controllers/g, '').slice(0, -1).slice(0, -1);
router.use(cookieParser());

router.post('/setDbParams', function(req, res, next){
	if(req.session.admin){
		var newParams = {
			database_ip: req.body.a,
			database_port: req.body.b,
			database_name: req.body.c,
			database_nick: req.body.d,
			databale_password: req.body.e
		}
		console.log(Folder);
		fs.writeFile(Folder+"settings.json", JSON.stringify(newParams), function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    res.send({code: 500, className: 'nSuccess', message: 'Параметры успешно сохранены!'});	
		}); 
		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

module.exports = router;
