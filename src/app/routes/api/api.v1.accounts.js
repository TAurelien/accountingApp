'use strict';

module.exports = function(apiV1Router) {

	// Accounts ----------------------------------------------------------------

	apiV1Router.route('/accounts')

		.get(function(req, res, next) {
			// TODO
			next(new Error('Not implemented'));
		})

		.post(function(req, res, next) {
			// TODO
			next(new Error('Not implemented'));
		});


	apiV1Router.route('/accounts/:id')

		.get(function(req, res, next) {
			// TODO
			next(new Error('Not implemented'));
		})

		.put(function(req, res, next) {
			// TODO
			next(new Error('Not implemented'));
		})

		.delete(function(req, res, next) {
			// TODO
			next(new Error('Not implemented'));
		});


};