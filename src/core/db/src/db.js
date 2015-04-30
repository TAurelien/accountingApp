'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');

module.exports = function (options, imports) {

	var logger = imports.logger.get('DB');

	return {

		connect: function (dbUrl, callback) {

			logger.info();
			logger.info('-----------------------------------------------------------');
			logger.info('Connecting to db', dbUrl, '...');
			logger.info('-----------------------------------------------------------');
			logger.info();

			if (_.isFunction(dbUrl)){
				callback = dbUrl;
				dbUrl = options.url;
				logger.warn('No db url provided as argument, using', dbUrl, 'from options');
			}

			mongoose.connect(dbUrl, function(err) {

				if (err) {

					logger.error();
					logger.error('-----------------------------------------------------------');
					logger.error('Could not connect to database :', dbUrl);
					logger.error(err);
					logger.error('-----------------------------------------------------------');
					logger.error();

					callback(err);

				} else {

					logger.info();
					logger.info('-----------------------------------------------------------');
					logger.info('Successful connection to db', dbUrl);
					logger.info('-----------------------------------------------------------');
					logger.info();

					callback(null);

				}

			});

		}

	};

};