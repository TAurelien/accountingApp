'use strict';

module.exports = function (options, imports, api) {

	var logger = imports.logger.get('Transactions ctrl - REST API');
	var restRouter = imports.restApi;

	restRouter.addRoute('/transactions', function (transactionsRoute) {

		transactionsRoute.get(function (req, res) {

			// TODO deal with the query
			var query = {
				conditions: null,
				order: null,
				selection: null
			};
			logger.debug('Getting transactions by REST API');
			api.list(query, function (err, items) {
				if (err) {
					res.send(err);
				} else {
					res.json(items);
				}
			});

		});

		transactionsRoute.post(function (req, res) {

			logger.debug('Creating transaction by REST API');
			var data = req.body;
			logger.debug(data);
			api.create(data, function (err) {
				if (err) {
					res.send(err);
				} else {
					res.json({
						message: 'Transaction created'
					});
				}
			});
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
					res.send(err);
				} else {
					res.json(item);
				}
			});

		});

		transactionRoute.put(function (req, res) {

			logger.debug('Updating a transaction by REST API');
			var id = req.params.transaction_id;
			var data = req.body;
			api.update(id, data, function (err) {
				if (err) {
					res.send(err);
				} else {
					res.json({
						message: 'Transaction updated'
					});
				}
			});

		});

		transactionRoute.delete(function (req, res) {

			logger.debug('Deleting a transaction by REST API');
			var id = req.params.transaction_id;
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
						message: 'Transaction deleted'
					});
				}
			});

		});

	});

};