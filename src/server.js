'use strict';
/* jshint unused:false */

// MODULES =====================================================================
console.log('Loading modules ...');
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');


// CONFIGURATION ===============================================================
console.log('Configuring the middlewares ...');
// set the port
var port = process.env.PORT || 8080;

// get all data/stuff of the body (POST) parameters
// --- parse application/json
app.use(bodyParser.json());
// --- parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// --- parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location
app.use(express.static(__dirname + '/public'));


// ROUTES ======================================================================
console.log('Defining the routing ...');
require('./app/routes/routes')(app, express);


// START =======================================================================
console.log('Starting the application ...');
app.listen(port);
console.log('Server started on port ' + port);