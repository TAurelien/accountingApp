'use strict';

module.exports = function (options, imports, api) {

	var logger = imports.logger.get('Transactions ctrl - REST API');
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

		if (req.query.accountId) {
			query.conditions = {
				splits: {
					$elemMatch: {
						account: req.query.accountId
					}
				}
			};
		}

		// TODO Handle request's queries

		return query;
	}

	// ------------------------------------------------------------------------

	restRouter.addRoute('/transactions', function (transactionsRoute) {

		transactionsRoute.get(function (req, res) {
			logger.debug('Getting transactions by REST API');

			var query = getQueryFromRequest(req);
			api.list(query, function (err, items) {
				if (err) {
					// TODO handle error type
					restRouter.sendResponse(res, 400, false, 'Error', err);
				} else {
					restRouter.sendResponse(res, 200, true, 'Transactions found', items);
				}
			}, true);

		});

		transactionsRoute.post(function (req, res) {
			logger.debug('Creating transaction by REST API');

			var data = req.body;
			api.create(data, function (err, createdItem) {
				if (err) {
					// TODO handle error type
					restRouter.sendResponse(res, 400, false, 'Error', err);
				} else {
					restRouter.sendResponse(res, 201, true, 'Transaction created', createdItem);
				}
			}, true);
		});

	});

	restRouter.addRoute('/transactions/:transaction_id', function (transactionRoute) {

		transactionRoute.get(function (req, res) {
			logger.debug('Getting a transaction by REST API');

			var id = req.params.transaction_id;
			var query = {
				selection: null
			};
			api.get(id, query, function (err, item) {
				if (err) {
					// TODO handle error type
					restRouter.sendResponse(res, 400, false, 'Error', err);
				} else {
					restRouter.sendResponse(res, 200, true, 'Transaction found', item);
				}
			}, true);

		});

		transactionRoute.put(function (req, res) {
			logger.debug('Updating a transaction by REST API');

			var id = req.params.transaction_id;
			var data = req.body;
			api.update(id, data, function (err, updatedItem) {
				if (err) {
					// TODO handle error type
					restRouter.sendResponse(res, 400, false, 'Error', err);
				} else {
					restRouter.sendResponse(res, 200, true, 'Transaction updated', updatedItem);
				}
			}, true);

		});

		transactionRoute.delete(function (req, res) {
			logger.debug('Deleting a transaction by REST API');

			var id = req.params.transaction_id;
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
					restRouter.sendResponse(res, 200, true, 'Transaction deleted', deletedItem);
				}
			}, true);

		});

	});

};