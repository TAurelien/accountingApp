/**
 *  @module   Account types API
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-14
 *  @version  1.0.0
 */
'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Account types API');
	var AccountType = require('../model').get();

	return {

		create: function (accountType, callback) {
			// TODO Define the create function on account types api
			throw new Error('Not yet implemented');
		},

		get: function (accountTypeID, query, callback) {
			// TODO Define the get function on account types api
			throw new Error('Not yet implemented');
		},

		list: function (query, callback) {
			// TODO Define the list function on account types api
			throw new Error('Not yet implemented');
		},

		update: function (accountTypeID, update, callback) {
			// TODO Define the update function on account types api
			throw new Error('Not yet implemented');
		},

		delete: function (query, callback) {
			// TODO Define the delete function on account types api
			throw new Error('Not yet implemented');
		},

		getNomenclatureData: function (callback) {
			logger.info('Getting the nomenclature data of account types');
			AccountType
				.find()
				.sort()
				.select({
					_id: 0
				})
				.lean()
				.exec(function (err, data) {
					if (err) {
						// TODO Check error type
						logger.error('Getting account types failed');
						logger.error(err);
						callback(err);
					} else {
						if (_.isEmpty(data)) {
							logger.warn('No account type has been found');
						} else {
							logger.info('Success of getting account types');
						}
						callback(null, data);
					}
				});
		},

		extractId: function (data) {
			return _.map(data, function (item) {
				return item.code;
			});
		}

	};

};