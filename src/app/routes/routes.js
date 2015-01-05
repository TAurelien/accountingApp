'use strict';

module.exports = function(app, express) {

	// API ROUTES --------------------------------------------------------------
	require('./api/api')(app, express);

	// CORE ROUTES ------------------------------------------------------------
	require('./routes.core')(app);

};