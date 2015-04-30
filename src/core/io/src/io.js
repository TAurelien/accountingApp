'use strict';

module.exports = function setup(options, imports, register) {
	console.log('Setting up the io core module ...');

	var logger = imports.logger.get('IO');
	
	var server = imports.expressApp.server;
	var io = require('socket.io')(server);

	io.on('connection', function (socket) {

		logger.info('Client connected:', socket.id);

		socket.on('disconnect', function () {
			logger.info('Client disconnected:', socket.id);
		});

	});

	// TODO Add an api namespace for the api call
	// TODO Set a middleware on the api namespace for the authentication
	// TODO Return the api io

	// Register --------------

	register(null, {
		io: io
	});

};