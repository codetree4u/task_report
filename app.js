var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();


// mongojs variables  - added by crtmp
var mongojs = require('mongojs');
var db = mongojs('OPS', ['ACH','PRENOTE','POSPAY']);

// body-parser variable - added by crtmp
var bodyParser = require('body-parser');
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));


var now = new Date();
//var now = new Date(nowUTC.getTime() - nowUTC.getTimezoneOffset()*60*1000);

const moment = require('moment')
const today = moment(now).startOf('day')
console.log(today);




///////////////
// added by crtmp - find all docs
// APIs below
app.get('/ACH', function (req, res,next) {
  var nowUTC = new Date();
  console.log('crtmp received a GET request');
  db.ACH.aggregate(
    [
      {
        $match:{
          CREATED:{$lte:new Date(nowUTC.getTime() - nowUTC.getTimezoneOffset()*60*1000)
          }
        }
      },
     {
        $lookup:
        {from :"FILEACK", // foreign collection
        localField:"ID", // field in the ACH collection
        foreignField:"ID", // field in the ACK collection
        as:"fromACK"
      }
    },  
    {
       $sort : 
       {
          CREATED : -1
         }
         }
  ],
 (function (err, docs) {
//    console.log(docs);
    res.json(docs);
    
  })
  )
});
// APIs 
app.get('/PRENOTE', function (req, res,next) {
  console.log('crtmp received a GET request');
  var nowUTC = new Date();
  db.PRENOTE.aggregate(
    [
      {
        $match:{
          CREATED:{$lte:new Date(nowUTC.getTime() - nowUTC.getTimezoneOffset()*60*1000)
          
          }
        }
      },
     {
        $lookup:
        {from :"FILEACK", // foreign collection
        localField:"ID", // field in the ACH collection
        foreignField:"ID", // field in the ACK collection
        as:"fromACK"
      }
    },  
    {
       $sort : 
       {
          CREATED : -1
         }
         }
  ],
 (function (err, docs) {
//    console.log(docs);
    res.json(docs);
    
  })
  )
});
app.get('/POSPAY', function (req, res,next) {
  console.log('crtmp received a GET request');
  var nowUTC = new Date();
  db.POSPAY.aggregate(
    [
      {
        $match:{
          CREATED:{$lte:new Date(nowUTC.getTime() - nowUTC.getTimezoneOffset()*60*1000)
          
          }
        }
      },
     {
        $lookup:
        {from :"FILEACK", // foreign collection
        localField:"ID", // field in the ACH collection
        foreignField:"ID", // field in the ACK collection
        as:"fromACK"
      }
    },  
    {
       $sort : 
       {
          CREATED : -1,
          ADMIN : 1
         }
         }
  ],
 (function (err, docs) {
//    console.log(docs);
    res.json(docs);
    
  })
  )
});
// added by crtmp - find 1 doc
app.get('/ACH/:id', function (req, res) {
  var id = req.params.id;
 // console.log(id);
  db.ACH.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});
// added by crtmp - replace
app.put('/ACH/:id', function (req, res) {
  var id = req.params.id;
  db.ACH.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: { ASSIGNEE: req.body.ASSIGNEE,STATUS: req.body.STATUS,RESOLUTION: req.body.RESOLUTION,COMMENT: req.body.COMMENT}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});
// added by crtmp - find 1 doc
app.get('/PRENOTE/:id', function (req, res) {
  var id = req.params.id;
 // console.log(id);
  db.PRENOTE.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});
// added by crtmp - replace
app.put('/PRENOTE/:id', function (req, res) {
  var id = req.params.id;
  db.PRENOTE.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: { ASSIGNEE: req.body.ASSIGNEE,STATUS: req.body.STATUS,RESOLUTION: req.body.RESOLUTION,COMMENT: req.body.COMMENT}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});
// added by crtmp - find 1 doc
// added by crtmp - find 1 doc
app.get('/POSPAY/:id', function (req, res) {
  var id = req.params.id;
 // console.log(id);
  db.POSPAY.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});
// added by crtmp - replace
app.put('/POSPAY/:id', function (req, res) {
  var id = req.params.id;
  db.POSPAY.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: { ASSIGNEE: req.body.ASSIGNEE,STATUS: req.body.STATUS,RESOLUTION: req.body.RESOLUTION,COMMENT: req.body.COMMENT}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',  require('./routes/index'));
app.use('/users', require('./routes/users'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
