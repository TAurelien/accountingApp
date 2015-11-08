'use strict';

module.exports = function (options, imports, api) {

	var logger = imports.logger.get('Accounts ctrl - REST API');
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

		if (req.query.generalLedgerId) {
			query.conditions = {
				generalLedger: req.query.generalLedgerId
			};
		}

		// TODO Handle request's queries

		return query;
	}

	// ------------------------------------------------------------------------

	restRouter.addRoute('/accounts', function (accountsRoute) {

		accountsRoute.get(function (req, res) {
			logger.info('Getting accounts by REST API');

			var query = getQueryFromRequest(req);
			api.list(query, function (err, items) {
				if (err) {
					// TODO handle error type
					restRouter.sendResponse(res, 400, false, 'Error', err);
				} else {
					restRouter.sendResponse(res, 200, true, 'Accounts found', items);
				}
			}, true);

		});

		accountsRoute.post(function (req, res) {
			logger.info('Creating account by REST API');

			var data = req.body;
			api.create(data, function (err, createdItem) {
				if (err) {
					// TODO handle error type
					restRouter.sendResponse(res, 400, false, 'Error', err);
				} else {
					restRouter.sendResponse(res, 201, true, 'Account created', createdItem);
				}
			}, true);
		});

	});

	restRouter.addRoute('/accounts/:account_id', function (accountRoute) {

		accountRoute.get(function (req, res) {
			logger.info('Getting an account by REST API');

			var id = req.params.account_id;
			var query = getQueryFromRequest(req);
			api.get(id, query, function (err, item) {
				if (err) {
					// TODO handle error type
					restRouter.sendResponse(res, 400, false, 'Error', err);
				} else {
					restRouter.sendResponse(res, 200, true, 'Account found', item);
				}
			}, true);

		});

		accountRoute.put(function (req, res) {
			logger.info('Updating an account by REST API');

			var id = req.params.account_id;
			var data = req.body;
			api.update(id, data, function (err, updatedItem) {
				if (err) {
					// TODO handle error type
					restRouter.sendResponse(res, 400, false, 'Error', err);
				} else {
					restRouter.sendResponse(res, 200, true, 'Account updated', updatedItem);
				}
			}, true);

		});

		accountRoute.delete(function (req, res) {
			logger.info('Deleting an account by REST API');

			var id = req.params.account_id;
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
					restRouter.sendResponse(res, 200, true, 'Account deleted', deletedItem);
				}
			}, true);

		});

	});

};