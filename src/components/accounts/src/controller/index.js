/**
 *  @module   Accounts Controller
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Accounts ctrl');
	var prefix = 'accounts';

	var IO = imports.io;
	var api = require('../api')(options, imports, emitter);

	// Sockets management
	IO.on('connection', function (socket) {

		var id = socket.id;
		var idLogged = '[socket:' + id + ']';

		logger.info(idLogged, 'Client connected to', prefix, 'IO');

		// --------------------------------------------------------------------

		socket.on('disconnect', function () {
			logger.info(idLogged, 'Client disconnected from', prefix, 'IO');
		});

		// --------------------------------------------------------------------

		socket.on(prefix + '.create', function (item) {
			logger.info(idLogged, 'Receiving a create event');
			api.create(item, function (err, createdItem) {
				IO.emit(prefix + '.created', err, createdItem);
			});
		});

		// --------------------------------------------------------------------

		socket.on(prefix + '.get', function (id, query) {
			logger.info(idLogged, 'Receiving a get event');
			api.get(id, query, function (err, item) {
				socket.emit(prefix + '.get', err, item);
			});
		});

		// --------------------------------------------------------------------

		socket.on(prefix + '.list', function (query) {
			logger.info(idLogged, 'Receiving a list event');
			api.list(query, function (err, items) {
				socket.emit(prefix + '.list', err, items);
			});
		});

		// --------------------------------------------------------------------

		socket.on(prefix + '.update', function (id, item) {
			logger.info(idLogged, 'Receiving a update event');
			api.update(id, item, function (err, updatedItem) {
				IO.emit(prefix + '.updated', err, updatedItem);
			});
		});

		// --------------------------------------------------------------------

		socket.on(prefix + '.delete', function (query) {
			logger.info(idLogged, 'Receiving a delete event');
			api.delete(query, function (err) {
				IO.emit(prefix + '.deleted', err);
			});
		});

		// --------------------------------------------------------------------

		socket.on(prefix + '.getBalance', function (accountRef, includeChilds) {
			logger.info(idLogged, 'Receiving a getBalance event');
			api.getBalance(accountRef, includeChilds, function (err, balance, accountId) {
				socket.emit(prefix + '.balance', err, balance, accountId);
			});
		});

		// --------------------------------------------------------------------

	});

};