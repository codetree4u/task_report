var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs('OPS', ['POSPAY']);


/* GET report page. */
router.get('/ppay', function(req, res, next) {
  res.render('ppay', { title: 'Express' });
});




module.exports = router;
