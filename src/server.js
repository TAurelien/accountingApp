'use-strict';

// Initial initialization of NODE_ENV if undefined
require('./config/init')();


// MODULES =====================================================================
var logger = require('./config/logger');
var config = require('./config/config');


// CONFIGURATION ===============================================================
config.init();

// initialize the express application
var app = require('./config/express')();


// START APP ===================================================================
app.listen(config.server.port);
logger.info(config.app.title + ' started on port ' + config.server.port);