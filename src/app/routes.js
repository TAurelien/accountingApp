'use strict';

module.exports = function(app){

	// server routes ===========================================================

	// api routes
	// ...

	//  frontend routes ========================================================

	//  routes to handle all front-end requests
	app.get('*', function(req, res){
		// load our public/index.html file, the front-end will handle
		// the routing from index.html
		res.sendfile('./public/index.html');

	});

};