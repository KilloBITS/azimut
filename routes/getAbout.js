'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', function(req, res, next){
  res.render('about.ejs',
  {
    sessionUser: req.session.user,
    isAdm: req.session.admin
  });  
});

module.exports = router;
