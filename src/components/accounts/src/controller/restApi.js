'use strict';

module.exports = function (options, imports, api) {

	var logger = imports.logger.get('Accounts ctrl - REST API');
	var restRouter = imports.restApi;

	restRouter.addRoute('/accounts', function (accountsRoute) {

		accountsRoute.get(function (req, res) {

			// TODO deal with the query
			var query = {
				conditions: null,
				order: null,
				selection: null
			};
			logger.debug('Getting accounts by REST API');
			api.list(query, function (err, items) {
				if (err) {
					res.send(err);
				} else {
					res.json(items);
				}
			});

		});

		accountsRoute.post(function (req, res) {

			logger.debug('Creating account by REST API');
			var data = req.body;
			logger.debug(data);
			api.create(data, function (err) {
				if (err) {
					res.send(err);
				} else {
					res.json({
						message: 'Account created'
					});
				}
			});
		});

	});

	restRouter.addRoute('/accounts/:account_id', function (accountRoute) {

		accountRoute.get(function (req, res) {

			logger.debug('Getting an account by REST API');
			var id = req.params.account_id;
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

		accountRoute.put(function (req, res) {

			logger.debug('Updating an account by REST API');
			var id = req.params.account_id;
			var data = req.body;
			api.update(id, data, function (err) {
				if (err) {
					res.send(err);
				} else {
					res.json({
						message: 'Account updated'
					});
				}
			});

		});

		accountRoute.delete(function (req, res) {

			logger.debug('Deleting an account by REST API');
			var id = req.params.account_id;
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
						message: 'Account deleted'
					});
				}
			});

		});

	});

};