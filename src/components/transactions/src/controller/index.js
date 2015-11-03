/**
 *  @module   Transactions Controller
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, emitter, Transactions) {

	var logger = imports.logger.get('Transactions ctrl');

	var IO = imports.io;
	var api = require('../api')(options, imports, emitter);

	// Sockets management
	IO.on('connection', function (socket) {

		var id = socket.id;
		var idLogged = '[socket:' + id + ']';

		logger.info(idLogged, 'Client connected to transactions IO');

		// --------------------------------------------------------------------

		socket.on('disconnect', function () {
			logger.info(idLogged, 'Client disconnected from transactions IO');
		});

		// --------------------------------------------------------------------

		socket.on(Transactions.events.TO_GET, function (id, query) {
			logger.info(idLogged, 'Receiving a', Transactions.events.TO_GET, 'event');
			api.get(id, query, function (err, item) {
				socket.emit(Transactions.events.GET, err, item);
			});
		});

		// --------------------------------------------------------------------

		socket.on(Transactions.events.TO_LIST, function (query) {
			logger.info(idLogged, 'Receiving a', Transactions.events.TO_LIST, 'event');
			api.list(query, function (err, items) {
				socket.emit(Transactions.events.LIST, err, items);
			});
		});

		// --------------------------------------------------------------------

		socket.on(Transactions.events.TO_GET_AMOUNT, function (accountID, transactionRef) {
			logger.info(idLogged, 'Receiving a', Transactions.events.TO_GET_AMOUNT, 'event');
			api.getAmount(accountID, transactionRef, function (err, amount) {
				socket.emit(Transactions.events.AMOUNT, err, amount);
			});
		});

		// --------------------------------------------------------------------

		socket.on(Transactions.events.TO_CREATE, function (data) {
			logger.info(idLogged, 'Receiving a', Transactions.events.TO_CREATE, 'event');
			api.create(data, function (err) {
				if (err) {
					socket.emit(Transactions.events.CREATED, err);
				}
			});
		});

		// --------------------------------------------------------------------

		socket.on(Transactions.events.TO_UPDATE, function (id, data) {
			logger.info(idLogged, 'Receiving a', Transactions.events.TO_UPDATE, 'event');
			api.update(id, data, function (err) {
				if (err) {
					socket.emit(Transactions.events.UPDATED, err);
				}
			});
		});

		// --------------------------------------------------------------------

		socket.on(Transactions.events.TO_DELETE, function (query) {
			logger.info(idLogged, 'Receiving a', Transactions.events.TO_DELETE, 'event');
			api.delete(query, function (err) {
				if (err) {
					socket.emit(Transactions.events.DELETED, err);
				}
			});
		});

		// --------------------------------------------------------------------

		Transactions.on(Transactions.events.CREATED, function (createdItem) {
			logger.info('Handling a', Transactions.events.CREATED, 'event');
			IO.emit(Transactions.events.CREATED, null, createdItem);
		});

		// --------------------------------------------------------------------

		Transactions.on(Transactions.events.UPDATED, function (updatedItem) {
			logger.info('Handling a', Transactions.events.UPDATED, 'event');
			IO.emit(Transactions.events.UPDATED, null, updatedItem);
		});

		// --------------------------------------------------------------------

		Transactions.on(Transactions.events.DELETED, function (deletedItem) {
			logger.info('Handling a', Transactions.events.DELETED, 'event');
			IO.emit(Transactions.events.DELETED, null, deletedItem);
		});

		// --------------------------------------------------------------------

	});

};