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


app.use('/', index);
app.use('/register', register);
app.use('/about', about);
app.use('/news', news);
app.use('/market',  market);
app.use('/detailsnews*', opennews);
app.use('/getDetailsTovar*', getTovar);
app.use('/contacts', contacts);
app.use('/roundtables', roundtables);


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

app.post('/checkedCaptcha', function(req, res){
	if(req.body.currentCaptcha === req.session.captcha){
		res.send({code: 500});
	}else{
		res.send({code:450, message: 'nevernaya captcha!'});
	}
});

app.get('*', get404);
/* POSTS */
const auth = require('./controllers/logInController');
app.post('/signin', auth);

const signUp = require('./controllers/registerController');
app.post('/signup', signUp);

const newComment = require('./controllers/setNewComment');
app.post('/newComment', newComment);

/* Started server */
app.listen(4334,'localhost' ,function(){
	global.baseName = 'AZIMUT';
	global.baseIP = 'mongodb://localhost:27017/';
	global.online = 0;
	console.log('Started server on "Azimut" from port: 4334');
});

//azimutbot@gmail.com
//qazwsx159357