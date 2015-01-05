'use strict';

module.exports = function(app, express) {

	// API V1 ==================================================================
	var apiV1Router = express.Router();

	// TODO Define the authentication

	// Defining the routes
	require('./api.v1.accounts')(apiV1Router);
	require('./api.v1.accountChart')(apiV1Router);

	// Register the api v1 router ----------------------------------------------
	app.use('/api/v1', apiV1Router);

};