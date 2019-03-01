global.sessionCreate = function(ip,port,name){
	app.use(session({
		secret: '2C44-4D44-WppQ38S',
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({
			url: 'mongodb://'+ip+':'+port+'/'+name
		}),
		cookie: {
	        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // two weeks
	    }
	}));
};