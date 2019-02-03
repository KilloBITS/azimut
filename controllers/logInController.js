'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/signin', function(req, res, next){
  res.send({code: 500, message: 'login succesfull'})
});

module.exports = router;
