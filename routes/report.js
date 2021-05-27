var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs('OPS', ['ACH']);


/* GET report page. */
router.get('/report', function(req, res, next) {
  res.render('report', { title: 'Express' });
});


module.exports = router;
