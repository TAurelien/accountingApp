'use-strict';

// Initial initialization of NODE_ENV if undefined
require('./config/init')();


// modules =====================================================================
var config = require('./config/config');


// configuration ===============================================================
config.init();

// initialize the express application
var app = require('./config/express')();


// start app ===================================================================
app.listen(config.server.port);
console.log(config.app.title + ' started on port ' + config.server.port);