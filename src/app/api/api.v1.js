'use strict';

module.exports = function(express) {

	var version = 'v1';

	var apiRouter = express.Router();

	// Accounts
	apiRouter.route('/' + version + '/accounts')

		.all(function(req, res, next) {
			next(new Error('Not implemented'));
		})

		.get(function(req, res, next) {
			next(new Error('Not implemented'));
		})

		.post(function(req, res, next) {
			next(new Error('Not implemented'));
		})

		.put(function(req, res, next) {
			next(new Error('Not implemented'));
		})

		.delete(function(req, res, next) {
			next(new Error('Not implemented'));
		});

};