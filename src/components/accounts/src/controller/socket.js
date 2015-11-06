'use strict';

module.exports = function (options, imports, api, Accounts) {

	var logger = imports.logger.get('Accounts ctrl - Socket');
	var IO = imports.io;

	IO.on('connection', function (socket) {

		var id = socket.id;
		var idLogged = '[socket:' + id + ']';

		logger.info(idLogged, 'Client connected to accounts IO');

		// --------------------------------------------------------------------

		socket.on('disconnect', function () {
			logger.info(idLogged, 'Client disconnected from accounts IO');
		});

		// --------------------------------------------------------------------

		Accounts.on(Accounts.events.CREATED, function (createdItem) {
			logger.info('Handling a', Accounts.events.CREATED, 'event');
			// TODO Remove err arg from event emitter
			IO.emit(Accounts.events.CREATED, null, createdItem);
		});

		// --------------------------------------------------------------------

		Accounts.on(Accounts.events.UPDATED, function (updatedItem) {
			logger.info('Handling a', Accounts.events.UPDATED, 'event');
			// TODO Remove err arg from event emitter
			IO.emit(Accounts.events.UPDATED, null, updatedItem);
		});

		// --------------------------------------------------------------------

		Accounts.on(Accounts.events.DELETED, function (deletedItem) {
			logger.info('Handling a', Accounts.events.DELETED, 'event');
			// TODO Remove err arg from event emitter
			IO.emit(Accounts.events.DELETED, null, deletedItem);
		});

		// --------------------------------------------------------------------

		Accounts.on(Accounts.events.BALANCE_CHANGED, function (updatedItem) {
			logger.info('Handling a', Accounts.events.BALANCE_CHANGED, 'event');
			// TODO Remove err arg from event emitter
			IO.emit(Accounts.events.BALANCE_CHANGED, null, updatedItem);
		});

		// --------------------------------------------------------------------

	});

};