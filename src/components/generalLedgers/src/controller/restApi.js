'use strict';

module.exports = function (options, imports, api) {

	var logger = imports.logger.get('General Ledgers ctrl - REST API');
	var restRouter = imports.restApi;

	// ------------------------------------------------------------------------

	function getQueryFromRequest(req) {
		var query = {
			conditions: null,
			order: null,
			selection: null
		};

		if (!req) {
			return query;
		}

		// TODO Handle request's queries

		return query;
	}

	// ------------------------------------------------------------------------

	restRouter.addRoute('/generalLedgers', function (generalLedgersRoute) {

		generalLedgersRoute.get(function (req, res) {
			logger.info('Getting general ledgers by REST API');

			var query = getQueryFromRequest(req);
			api.list(query, function (err, items) {
				if (err) {
					// TODO handle error type
					restRouter.sendResponse(res, 400, false, 'Error', err);
				} else {
					restRouter.sendResponse(res, 200, true, 'General ledgers found', items);
				}
			}, true);

		});

		generalLedgersRoute.post(function (req, res) {
			logger.info('Creating general ledger by REST API');

			var data = req.body;
			api.create(data, function (err, createdItem) {
				if (err) {
					// TODO handle error type
					restRouter.sendResponse(res, 400, false, 'Error', err);
				} else {
					restRouter.sendResponse(res, 201, true, 'General ledger created', createdItem);
				}
			}, true);
		});

	});

	restRouter.addRoute('/generalLedgers/:generalLedger_id', function (generalLedgerRoute) {

		generalLedgerRoute.get(function (req, res) {
			logger.info('Getting a general ledger by REST API');

			var id = req.params.generalLedger_id;
			var query = getQueryFromRequest(req);
			api.get(id, query, function (err, item) {
				if (err) {
					// TODO handle error type
					restRouter.sendResponse(res, 400, false, 'Error', err);
				} else {
					restRouter.sendResponse(res, 200, true, 'General ledger found', item);
				}
			}, true);

		});

		generalLedgerRoute.put(function (req, res) {
			logger.info('Updating a general ledger by REST API');

			var id = req.params.generalLedger_id;
			var data = req.body;
			api.update(id, data, function (err, updatedItem) {
				if (err) {
					// TODO handle error type
					restRouter.sendResponse(res, 400, false, 'Error', err);
				} else {
					restRouter.sendResponse(res, 200, true, 'General ledger updated', updatedItem);
				}
			}, true);

		});

		generalLedgerRoute.delete(function (req, res) {
			logger.info('Deleting a general ledger by REST API');

			var id = req.params.generalLedger_id;
			var query = {
				conditions: {
					_id: id
				}
			};
			api.delete(query, function (err, deletedItem) {
				if (err) {
					// TODO handle error type
					restRouter.sendResponse(res, 400, false, 'Error', err);
				} else {
					restRouter.sendResponse(res, 200, true, 'General ledger deleted', deletedItem);
				}
			}, true);

		});

	});

};