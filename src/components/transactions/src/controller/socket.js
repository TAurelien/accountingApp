'use strict';

module.exports = function (options, imports, api, Transactions) {

	var logger = imports.logger.get('Transactions ctrl - Socket');
	var IO = imports.io;

	IO.on('connection', function (socket) {

		var id = socket.id;
		var idLogged = '[socket:' + id + ']';

		logger.info(idLogged, 'Client connected to transactions IO');

		// --------------------------------------------------------------------

		socket.on('disconnect', function () {
			logger.info(idLogged, 'Client disconnected from transactions IO');
		});

		// --------------------------------------------------------------------

		Transactions.on(Transactions.events.CREATED, function (createdItem) {
			logger.info('Handling a', Transactions.events.CREATED, 'event');
			// TODO Remove err arg from event emitter
			IO.emit(Transactions.events.CREATED, null, createdItem);
		});

		// --------------------------------------------------------------------

		Transactions.on(Transactions.events.UPDATED, function (updatedItem) {
			logger.info('Handling a', Transactions.events.UPDATED, 'event');
			// TODO Remove err arg from event emitter
			IO.emit(Transactions.events.UPDATED, null, updatedItem);
		});

		// --------------------------------------------------------------------

		Transactions.on(Transactions.events.DELETED, function (deletedItem) {
			logger.info('Handling a', Transactions.events.DELETED, 'event');
			// TODO Remove err arg from event emitter
			IO.emit(Transactions.events.DELETED, null, deletedItem);
		});

		// --------------------------------------------------------------------

	});

};