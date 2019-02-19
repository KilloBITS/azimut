'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');
const http = require('http');
const options = {pingInterval: 10, cookie: false};


let app = express();
let server = http.createServer(app);

const io = require('socket.io').listen(server,  options);
global.socketIO = io;

router.use(cookieParser());

router.post('/opendialog*', function(req, res, next){
	if(req.session.user !== undefined){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const msg = db.collection("MESSAGE");

			if(err) return console.log(err);

			msg.find({to: { $in: [ req.session.poziv, req.body.user ]}, do: { $in: [ req.session.poziv, req.body.user ]} }).sort({AI: 1}).limit(20).toArray(function(err, resDlg){	
				res.send({code: 500, data: resDlg, my: req.session.poziv});	
			});		
		});
	}else{
		res.send({code: 403, message: 'У вас нет доступа!'})
	}
});

var CreateNewMessage = function(req, res, next){
	if(req.session.user !== undefined){
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

		mongoClient.connect(global.baseIP, function(err, clientMDB){
			const db = clientMDB.db(global.baseName);
			const msg = db.collection("MESSAGE");
			msg.find().toArray(function(err, resDlg){	
				var NEW_MESSAGE = {};
				NEW_MESSAGE.to = req.session.poziv;
				NEW_MESSAGE.do = req.body.a;
				NEW_MESSAGE.date = today;
				NEW_MESSAGE.time = datetime;
				NEW_MESSAGE.text = req.body.b;
				NEW_MESSAGE.views = false;
				NEW_MESSAGE.AI = resDlg.length;
				msg.insertOne(NEW_MESSAGE);

				res.send({code: 500, data: NEW_MESSAGE });
			});			
		});		
	}else{
		res.send({code: 403, message: 'У вас нет доступа!'})
	}	
};

router.post('/sendMessage', CreateNewMessage, function(req, res, next){});

var allClients = [];
var users = {};
//sockets methods
io.sockets.on('connection', function (client) {
	client.on('clientConnect', function(data){ //подключение к чату
        client.username = data.nickName;        
		users[data.nickName.replace(/\s/g, '')] = client.id;

		mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, clientUser){
	  	    const db = clientUser.db(global.baseName);
		    const user = db.collection("USERS");		      
	        user.update({ pozivnoy: data.nickName.replace(/\s/g, '') },{$set: {onlineSession: true}});
    	});
	});

    client.on('getonline', function(data){ 
    	mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, clientUser){
	  	    const db = clientUser.db(global.baseName);
		    const user = db.collection("USERS");    
	        user.find({ pozivnoy: data.my.replace(/\s/g, '') }).toArray(function(err, friends ){
	        	user.find({ pozivnoy: {$in: friends[0].friend} }).toArray(function(err, friendsParse ){
	        		client.emit('getonline', {code: 500, data: friendsParse});
		        });
	        });
    	});        
    });

    client.on('writing', function(MD){     	
    	try{
    		console.log(MD.user)
			io.sockets.connected[users[MD.user]].emit('writing', {code: 500, user: MD.my});  
		}catch(e){
			console.log('Сообщение не отправлено, пользователь не в сети')
		}	 
    });

    client.on('messages', function (MD) { //функция отправки сообщений
    		var NEW_MESSAGE = {};
				NEW_MESSAGE.to = MD.my;
				NEW_MESSAGE.do = MD.user;
				NEW_MESSAGE.date = '';
				NEW_MESSAGE.time = 'Только что';
				NEW_MESSAGE.text = MD.resDlg;	
				NEW_MESSAGE.views = false;			
		try{
			io.sockets.connected[users[MD.user]].emit('messages', {code: 500, data: NEW_MESSAGE});
		}catch(e){
			console.log('Сообщение не отправлено, пользователь не в сети')
		}		
    });

    client.on('disconnect', function() {
    	console.log('suka: '+client.username);
    	try{
    		if(client.username !== undefined){
	    			mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, clientUser){
			  	    const db = clientUser.db(global.baseName);
				    const user = db.collection("USERS");		      
			        user.update({ pozivnoy: client.username.replace(/\s/g, '') },{$set: {onlineSession: false}});
	      			delete users[client.username.replace(/\s/g, '')];
			    });
	    	}    		
    	}catch(e){

    	}
      
      var i = allClients.indexOf(client);
      allClients.splice(i, 1);
   	});
});

server.listen(4335, function (err) {
	console.log('Started server on "Chat" from port: 4335');
});

module.exports = router;
