/**
 *  @module   General ledgers Controller
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, emitter, GeneralLedgers) {

	var logger = imports.logger.get('General Ledgers ctrl');

	var IO = imports.io;
	var api = require('../api')(options, imports, emitter);
	var Accounts = imports.accounts;

	// Sockets management
	IO.on('connection', function (socket) {

		var id = socket.id;
		var idLogged = '[socket:' + id + ']';

		logger.info(idLogged, 'Client connected to generalLedgers IO');

		// --------------------------------------------------------------------

		socket.on('disconnect', function () {
			logger.info(idLogged, 'Client disconnected from generalLedgers IO');
		});

		// --------------------------------------------------------------------

		socket.on(GeneralLedgers.events.TO_GET, function (id, query) {
			logger.info(idLogged, 'Receiving a', GeneralLedgers.events.TO_GET, 'event');
			api.get(id, query, function (err, item) {
				socket.emit(GeneralLedgers.events.GET, err, item);
			});
		});

		// --------------------------------------------------------------------

		socket.on(GeneralLedgers.events.TO_LIST, function (query) {
			logger.info(idLogged, 'Receiving a', GeneralLedgers.events.TO_LIST, 'event');
			api.list(query, function (err, items) {
				socket.emit(GeneralLedgers.events.LIST, err, items);
			});
		});

		// --------------------------------------------------------------------

		socket.on(GeneralLedgers.events.TO_GET_NET_WORTH, function (generalLedgerRef) {
			logger.info(idLogged, 'Receiving a', GeneralLedgers.events.TO_GET_NET_WORTH, 'event');
			api.getNetWorth(generalLedgerRef, function (err, netWorth, generalLedgerId) {
				socket.emit(GeneralLedgers.events.NET_WORTH, err, netWorth, generalLedgerId);
			});
		});

		// --------------------------------------------------------------------

		socket.on(GeneralLedgers.events.TO_CREATE, function (data) {
			logger.info(idLogged, 'Receiving a', GeneralLedgers.events.TO_CREATE, 'event');
			api.create(data, function (err) {
				if (err) {
					socket.emit(GeneralLedgers.events.CREATED, err);
				}
			});
		});

		// --------------------------------------------------------------------

		socket.on(GeneralLedgers.events.TO_UPDATE, function (id, data) {
			logger.info(idLogged, 'Receiving a', GeneralLedgers.events.TO_UPDATE, 'event');
			api.update(id, data, function (err) {
				if (err) {
					socket.emit(GeneralLedgers.events.UPDATED, err);
				}
			});
		});

		// --------------------------------------------------------------------

		socket.on(GeneralLedgers.events.TO_DELETE, function (query) {
			logger.info(idLogged, 'Receiving a', GeneralLedgers.events.TO_DELETE, 'event');
			api.delete(query, function (err) {
				if (err) {
					socket.emit(GeneralLedgers.events.DELETED, err);
				}
			});
		});

		// --------------------------------------------------------------------

		GeneralLedgers.on(GeneralLedgers.events.CREATED, function (createdItem) {
			logger.info('Handling a', GeneralLedgers.events.CREATED, 'event');
			IO.emit(GeneralLedgers.events.CREATED, null, createdItem);
		});

		// --------------------------------------------------------------------

		GeneralLedgers.on(GeneralLedgers.events.UPDATED, function (updatedItem) {
			logger.info('Handling a', GeneralLedgers.events.UPDATED, 'event');
			IO.emit(GeneralLedgers.events.UPDATED, null, updatedItem);
		});

		// --------------------------------------------------------------------

		GeneralLedgers.on(GeneralLedgers.events.DELETED, function (deletedItem) {
			logger.info('Handling a', GeneralLedgers.events.DELETED, 'event');
			IO.emit(GeneralLedgers.events.DELETED, null, deletedItem);
		});

		// --------------------------------------------------------------------

	});

	//Backend management
	Accounts.on(Accounts.events.CREATED, function (createdItem) {
		logger.info('Handling a', Accounts.events.CREATED, 'event');
		logger.debug('An account has been created, I should update the corresponding general ledger');
		logger.debug(createdItem.id);
	});

	Accounts.on(Accounts.events.UPDATED, function (updatedItem) {
		logger.info('Handling a', Accounts.events.UPDATED, 'event');
		logger.debug('An account has been updated, I should update the corresponding general ledger');
		logger.debug(updatedItem.id);
	});

	Accounts.on(Accounts.events.DELETED, function (deletedItem) {
		logger.info('Handling a', Accounts.events.DELETED, 'event');
		logger.debug('An account has been deleted, I should update the corresponding general ledger');
		logger.debug(deletedItem.id);
	});

	Accounts.on(Accounts.events.BALANCE_CHANGED, function (item) {
		logger.info('Handling a', Accounts.events.BALANCE_CHANGED, 'event');
		logger.debug('The balance of an account has been changed, I should update the corresponding general ledger');
		logger.debug(item.id);
	});

};