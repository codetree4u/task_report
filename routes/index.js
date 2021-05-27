var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs('OPS', ['YEAR19','PRENOTE','POSPAY']);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/report', function(req, res, next) {
  res.render('report', { title: 'Express' });
});
router.get('/pnote', function(req, res, next) {
  res.render('pnote', { title: 'Express' });
});
router.get('/ppay', function(req, res, next) {
  res.render('ppay', { title: 'Express' });
});
module.exports = router;
