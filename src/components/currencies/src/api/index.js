/**
 *  @module   Currencies API
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

	var logger = imports.logger.get('Currencies API');
	var Currency = require('../model').get();

	return {

		create: function (data, callback) {
			// TODO Define the create function on currencies api
			throw new Error('Not yet implemented');
		},

		get: function (id, query, callback) {
			// TODO Define the get function on currencies api
			throw new Error('Not yet implemented');
		},

		list: function (query, callback) {
			// TODO Define the list function on currencies api
			throw new Error('Not yet implemented');
		},

		update: function (id, data, callback) {
			// TODO Define the update function on currencies api
			throw new Error('Not yet implemented');
		},

		delete: function (query, callback) {
			// TODO Define the delete function on currencies api
			throw new Error('Not yet implemented');
		},

		getNomenclatureData: function (callback) {
			logger.info('Getting the nomenclature data of currencies');
			Currency
				.find()
				.sort()
				.select({
					_id: 0
				})
				.lean()
				.exec(function (err, data) {
					if (err) {
						// TODO Check error type
						logger.error('Getting currencies failed');
						logger.error(err);
						callback(err);
					} else {
						if (_.isEmpty(data)) {
							logger.warn('No currency has been found');
						} else {
							logger.info('Success of getting currencies');
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