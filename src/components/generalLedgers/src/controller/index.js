/**
 *  @module   General ledgers Controller
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('General Ledgers ctrl');
	var prefix = 'generalLedgers';

	var IO = imports.io;
	var api = require('../api')(options, imports, emitter);

	// Sockets management
	IO.on('connection', function (socket) {

		logger.info('Client connected to', prefix, 'IO');

		// --------------------------------------------------------------------

		socket.on('disconnect', function () {
			logger.info('Client disconnected from', prefix, 'IO');
		});

		// --------------------------------------------------------------------

		socket.on(prefix + '.create', function (item) {
			logger.info('Receiving a create event');
			api.create(item, function (err, createdItem) {
				IO.emit(prefix + '.created', err, createdItem);
			});
		});

		// --------------------------------------------------------------------

		socket.on(prefix + '.get', function (id, query) {
			logger.info('Receiving a get event');
			api.get(id, query, function (err, item) {
				IO.emit(prefix + '.get', err, item);
			});
		});

		// --------------------------------------------------------------------

		socket.on(prefix + '.list', function (query) {
			logger.info('Receiving a list event');
			api.list(query, function (err, items) {
				IO.emit(prefix + '.list', err, items);
			});
		});

		// --------------------------------------------------------------------

		socket.on(prefix + '.update', function (id, item) {
			logger.info('Receiving a update event');
			api.update(id, item, function (err, updatedItem) {
				IO.emit(prefix + '.updated', err, updatedItem);
			});
		});

		// --------------------------------------------------------------------

		socket.on(prefix + '.delete', function (query) {
			logger.info('Receiving a delete event');
			api.delete(query, function (err) {
				IO.emit(prefix + '.deleted', err);
			});
		});

		// --------------------------------------------------------------------

		socket.on(prefix + '.getNetWorth', function (generalLedgerRef) {
			logger.info('Receiving a getNetWorth event');
			api.getNetWorth(generalLedgerRef, function (err, netWorth) {
				IO.emit(prefix + '.netWorth', err, netWorth);
			});
		});

		// --------------------------------------------------------------------

	});

};