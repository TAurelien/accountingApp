'use-strict';
/* jshint unused:false */

require('./config/init')();


// modules =====================================================================
var config         = require('./config/config');
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');


// configuration ===============================================================

// connect to our mongoDB database
// mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// --- parse application/json
app.use(bodyParser.json());

// --- parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// --- parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location
app.use(express.static(__dirname + '/public'));


// routes ======================================================================
require('./app/routes')(app);


// start app ===================================================================
app.listen(config.port);
console.log(config.app.title + ' started on port ' + config.port);

exports = module.exports = app;