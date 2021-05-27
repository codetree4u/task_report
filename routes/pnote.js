var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs('OPS', ['PRENOTE']);


/* GET report page. */
router.get('/pnote', function(req, res, next) {
  res.render('pnote', { title: 'Express' });
});




module.exports = router;
