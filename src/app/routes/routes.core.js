'use strict';

var path = require('path');

module.exports = function(app){
	//  routes to handle all front-end requests

	app.get('*', function(req, res){
		// load our public/index.html file, the front-end will handle
		// the routing from index.html
		res.sendFile(path.join(__dirname + '../../public/index.html'));

	});

};