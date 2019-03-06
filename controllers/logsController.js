'use strict';
const mongoClient = require("mongodb").MongoClient;

global.setLog = function(type, subject, textData, user){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const LOGS = db.collection("LOGS");
		if(err) return console.log(err);		

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();
		if(dd<10) {
			dd = '0'+dd
		}
		if(mm<10) {
			mm = '0'+mm
		}
		today = mm + '-' + dd + '-' + yyyy;


		var currentdate = new Date(); 
		var datetime = currentdate.getHours() + ":"  
		+ currentdate.getMinutes() + ":" 
		+ currentdate.getSeconds();


		switch(type){
			case 0: var typeLog = 'error'; break;
			case 1: var typeLog = 'warning'; break;
			case 2: var typeLog = 'message'; break;
			case 3: var typeLog = 'good'; break;
			case 4: var typeLog = 'good'; break;
		}

		var NEW_LOGS = {};
		NEW_LOGS.date = today;
		NEW_LOGS.time = datetime;
		NEW_LOGS.type = subject;
		NEW_LOGS.text = textData;
		NEW_LOGS.user = user;
		NEW_LOGS.logo = typeLog;
		LOGS.insertOne(NEW_LOGS);
				
	});
}