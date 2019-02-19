'use strict';  //use ES6
const http = require('http');
const https = require('https');
const express = require('express');
const bParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const mongoClient = require("mongodb").MongoClient;
const request = require("request");
const svgCaptcha = require('svg-captcha');
const app = express();
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

app.use(session({
	secret: '2C44-4D44-WppQ38S',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		url: 'mongodb://localhost:27017/AZIMUT'
	}),
	cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // two weeks
    }
}));

//project libs use
app.use(bParser.urlencoded({limit: '50mb'}));
app.use(bParser.json());
app.use(express.static(__dirname + '/public/'));
app.use(cookieParser());
app.use(bParser.raw({limit: '50mb'}));

//routes pages
const get404 = require('./routes/get404');
const index = require('./routes/getIndex');
const register = require('./routes/getRegister');
const about = require('./routes/getAbout');
const news = require('./routes/getNews');
const opennews = require('./routes/getOpenNews');
const market = require('./routes/getFlea_market');
const getTovar = require('./routes/getDetailsTovar');
const contacts = require('./routes/getContacts');
const roundtables = require('./routes/getRoundtables');
const profile = require('./routes/getProfile');
const authAcc = require('./routes/getsData/authificateAccaunt');
const forgotPass = require('./routes/getForgotpasswored');
const whf = require('./routes/getVHF');
const hf = require('./routes/getHF');

app.use('/', index);
app.use('/register', register);
app.use('/about', about);
app.use('/news', news);
app.use('/market',  market);
app.use('/detailsnews*', opennews);
app.use('/getDetailsTovar*', getTovar);
app.use('/contacts', contacts);
app.use('/roundtables', roundtables);
app.use('/getProfile', profile);
app.use('/activate-accaunt*', authAcc);
app.use('/forgotPass', forgotPass);
app.use('/VHF', whf);
app.use('/HF', hf);

app.get('/logout', function(req, res) {
	req.session.destroy(function(err) {})
	res.redirect('/');
});

app.get('/captcha*', function (req, res) {
	var captcha = svgCaptcha.create();
	req.session.captcha = captcha.text;    
	console.log(captcha.text)
	res.type('svg');
	res.status(200).send(captcha.data);
});

app.get('*', get404);
/* POSTS */
app.post('/checkedCaptcha', function(req, res){
	if(req.body.currentCaptcha === req.session.captcha){
		res.send({code: 500});
	}else{
		res.send({code:450,className:'nError', message: 'Неверная капча!'});
	}
});

const auth = require('./controllers/logInController');
app.post('/signin', auth);

const signUp = require('./controllers/registerController');
app.post('/signup', signUp);

const newComment = require('./controllers/setNewComment');
app.post('/newComment', newComment);

const opendialog = require('./controllers/openDlgController');
app.post('/opendialog*', opendialog);

const CreateNewMessage = require('./controllers/openDlgController');
app.post('/sendMessage', CreateNewMessage);

const userParamsController = require('./controllers/userParamsController');
app.post('/setParamsUser', userParamsController);

const changePasswordController = require('./controllers/changePasswordController');
app.post('/changePass', changePasswordController);

const updateAvaUser = require('./controllers/avatarController');
app.post('/updateAvaUser', updateAvaUser);

const getallnews = require('./controllers/getAllNewsController');
app.post('/getAllNews', getallnews);


function sravnenie(arr, arr2){
	if(arr.length != arr2.length) return false
	var on = 0;
	for( var i = 0; i < arr.length; i++ ){
		for( var j = 0; j < arr2.length; j++ ){
			if(arr[i] === arr2[j]){
				on++
				break
			}
		}
	}
	return on==arr.length?true:false
}

/* Started server */
app.listen(4334,function(){
	global.baseName = 'AZIMUT';
	global.baseIP = 'mongodb://localhost:27017/';
	global.online = 0;
	var defaultCollections = ['COMMENTS','CONFIG','LOGS','MARKET','NEWS','USERS','sessions','MESSAGE'];
	var currentCollections = [];
	mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
		const db = client.db(global.baseName);
		db.listCollections().toArray(function(err, collections){
			for(let ic = 0; ic < collections.length; ic++){
				currentCollections.push(collections[ic].name);
			}
			if(sravnenie(currentCollections, defaultCollections)){
				console.log('Проверка базы завершена, все таблицы присутствуют')
			} 
		});
	});
	console.log('Started server on "Azimut" from port: 4334');
});