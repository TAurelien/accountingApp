'use strict';

module.exports = function (options, imports, api) {

	var logger = imports.logger.get('General Ledgers ctrl - REST API');
	var restRouter = imports.restApi;

	restRouter.addRoute('/generalLedgers', function (generalLedgersRoute) {

		generalLedgersRoute.get(function (req, res) {

			// TODO deal with the query
			var query = {
				conditions: null,
				order: null,
				selection: null
			};
			logger.debug('Getting general ledgers by REST API');
			api.list(query, function (err, items) {
				if (err) {
					res.send(err);
				} else {
					res.json(items);
				}
			});

		});

		generalLedgersRoute.post(function (req, res) {

			logger.debug('Creating general ledger by REST API');
			var data = req.body;
			logger.debug(data);
			api.create(data, function (err) {
				if (err) {
					res.send(err);
				} else {
					res.json({
						message: 'General Ledger created'
					});
				}
			});
		});

	});

	restRouter.addRoute('/generalLedgers/:generalLedger_id', function (generalLedgerRoute) {

		generalLedgerRoute.get(function (req, res) {

			logger.debug('Getting a general ledger by REST API');
			var id = req.params.generalLedger_id;
			var query = {
				selection: null
			};
			api.get(id, query, function (err, item) {
				if (err) {
					res.send(err);
				} else {
					res.json(item);
				}
			});

		});

		generalLedgerRoute.put(function (req, res) {

			logger.debug('Updating a general ledger by REST API');
			var id = req.params.generalLedger_id;
			var data = req.body;
			api.update(id, data, function (err) {
				if (err) {
					res.send(err);
				} else {
					res.json({
						message: 'General ledger updated'
					});
				}
			});

		});

		generalLedgerRoute.delete(function (req, res) {

			logger.debug('Deleting a general ledger by REST API');
			var id = req.params.generalLedger_id;
			var query = {
				conditions: {
					_id: id
				}
			};
			api.delete(query, function (err) {
				if (err) {
					res.send(err);
				} else {
					res.json({
						message: 'General ledger deleted'
					});
				}
			});

		});

	});

};