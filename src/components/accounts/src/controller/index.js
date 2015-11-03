/**
 *  @module   Accounts Controller
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, emitter, Accounts) {

	var logger = imports.logger.get('Accounts ctrl');

	var IO = imports.io;
	var api = require('../api')(options, imports, emitter);
	var Transactions = imports.transactions;

	// Sockets management
	IO.on('connection', function (socket) {

		var id = socket.id;
		var idLogged = '[socket:' + id + ']';

		logger.info(idLogged, 'Client connected to accounts IO');

		// --------------------------------------------------------------------

		socket.on('disconnect', function () {
			logger.info(idLogged, 'Client disconnected from accounts IO');
		});

		// --------------------------------------------------------------------

		socket.on(Accounts.events.TO_GET, function (id, query) {
			logger.info(idLogged, 'Receiving a', Accounts.events.TO_GET, 'event');
			api.get(id, query, function (err, item) {
				socket.emit(Accounts.events.GET, err, item);
			});
		});

		// --------------------------------------------------------------------

		socket.on(Accounts.events.TO_GET_ALL, function (generalLedgerId) {
			logger.info(idLogged, 'Receiving a', Accounts.events.TO_GET_ALL, 'event');
			var query = {
				conditions: {
					generalLedger: generalLedgerId,
				},
				order: null,
				selection: null
			};
			api.list(query, function (err, items) {
				socket.emit(Accounts.events.GET_ALL, err, generalLedgerId, items);
			});
		});

		// --------------------------------------------------------------------

		socket.on(Accounts.events.TO_LIST, function (query) {
			logger.info(idLogged, 'Receiving a', Accounts.events.TO_LIST, 'event');
			api.list(query, function (err, items) {
				socket.emit(Accounts.events.LIST, err, items);
			});
		});

		// --------------------------------------------------------------------

		socket.on(Accounts.events.TO_GET_BALANCE, function (accountRef, includeChilds) {
			logger.info(idLogged, 'Receiving a', Accounts.events.TO_GET_BALANCE, 'event');
			api.getBalance(accountRef, includeChilds, function (err, balance, accountId) {
				socket.emit(Accounts.events.BALANCE, err, balance, accountId);
			});
		});

		// --------------------------------------------------------------------

		socket.on(Accounts.events.TO_CREATE, function (data) {
			logger.info(idLogged, 'Receiving a', Accounts.events.TO_CREATE, 'event');
			api.create(data, function (err) {
				if (err) {
					socket.emit(Accounts.events.CREATED, err);
				}
			});
		});

		// --------------------------------------------------------------------

		socket.on(Accounts.events.TO_UPDATE, function (id, data) {
			logger.info(idLogged, 'Receiving a', Accounts.events.TO_UPDATE, 'event');
			api.update(id, data, function (err) {
				if (err) {
					socket.emit(Accounts.events.UPDATED, err);
				}
			});
		});

		// --------------------------------------------------------------------

		socket.on(Accounts.events.TO_DELETE, function (query) {
			logger.info(idLogged, 'Receiving a', Accounts.events.TO_DELETE, 'event');
			api.delete(query, function (err) {
				if (err) {
					socket.emit(Accounts.events.DELETED, err);
				}
			});
		});

		// --------------------------------------------------------------------

		/*Accounts.on(Accounts.events.CREATED, function (createdItem) {
			logger.info('Handling a', Accounts.events.CREATED, 'event');
			IO.emit(Accounts.events.CREATED, null, createdItem);
		});*/

		// --------------------------------------------------------------------

		/*Accounts.on(Accounts.events.UPDATED, function (updatedItem) {
			logger.info('Handling a', Accounts.events.UPDATED, 'event');
			IO.emit(Accounts.events.UPDATED, null, updatedItem);
		});*/

		// --------------------------------------------------------------------

		/*Accounts.on(Accounts.events.DELETED, function (deletedItem) {
			logger.info('Handling a', Accounts.events.DELETED, 'event');
			IO.emit(Accounts.events.DELETED, null, deletedItem);
		});*/

		// --------------------------------------------------------------------

	});

	// Backend management
	Transactions.on(Transactions.events.CREATED, function (createdItem) {
		logger.info('Handling a', Transactions.events.CREATED, 'event');
		logger.debug('A transaction has been created, I should update the corresponding accounts');
		logger.debug(createdItem.id);
		emitter.emitBalanceChanged();
	});

	Transactions.on(Transactions.events.UPDATED, function (updatedItem) {
		logger.info('Handling a', Transactions.events.UPDATED, 'event');
		logger.debug('A transaction has been updated, I should update the corresponding accounts');
		logger.debug(updatedItem.id);
		emitter.emitBalanceChanged();
	});

	Transactions.on(Transactions.events.DELETED, function (deletedItem) {
		logger.info('Handling a', Transactions.events.DELETED, 'event');
		logger.debug('A transaction has been deleted, I should update the corresponding accounts');
		logger.debug(deletedItem.id);
		emitter.emitBalanceChanged();
	});

};