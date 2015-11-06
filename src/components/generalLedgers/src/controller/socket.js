'use strict';

module.exports = function (options, imports, api, GeneralLedgers) {

	var logger = imports.logger.get('General Ledgers ctrl - Socket');
	var IO = imports.io;

	IO.on('connection', function (socket) {

		var id = socket.id;
		var idLogged = '[socket:' + id + ']';

		logger.info(idLogged, 'Client connected to generalLedgers IO');

		// --------------------------------------------------------------------

		socket.on('disconnect', function () {
			logger.info(idLogged, 'Client disconnected from generalLedgers IO');
		});

		// --------------------------------------------------------------------

		GeneralLedgers.on(GeneralLedgers.events.CREATED, function (createdItem) {
			logger.info('Handling a', GeneralLedgers.events.CREATED, 'event');
			// TODO Remove err arg from event emitter
			IO.emit(GeneralLedgers.events.CREATED, null, createdItem);
		});

		// --------------------------------------------------------------------

		GeneralLedgers.on(GeneralLedgers.events.UPDATED, function (updatedItem) {
			logger.info('Handling a', GeneralLedgers.events.UPDATED, 'event');
			// TODO Remove err arg from event emitter
			IO.emit(GeneralLedgers.events.UPDATED, null, updatedItem);
		});

		// --------------------------------------------------------------------

		GeneralLedgers.on(GeneralLedgers.events.DELETED, function (deletedItem) {
			logger.info('Handling a', GeneralLedgers.events.DELETED, 'event');
			// TODO Remove err arg from event emitter
			IO.emit(GeneralLedgers.events.DELETED, null, deletedItem);
		});

		// --------------------------------------------------------------------

		GeneralLedgers.on(GeneralLedgers.events.NET_WORTH_CHANGED, function (updatedItem) {
			logger.info('Handling a', GeneralLedgers.events.NET_WORTH_CHANGED, 'event');
			// TODO Remove err arg from event emitter
			IO.emit(GeneralLedgers.events.NET_WORTH_CHANGED, null, updatedItem);
		});

		// --------------------------------------------------------------------

	});

};