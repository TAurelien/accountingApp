/** @module Env Dev */
'use strict';


// Module dependencies ========================================================
var logger = require(global.app.logger)('Env Dev');


// Exported object ============================================================

/**
 *  [exports description]
 *
 *  @type  {Object}
 */
module.exports = {

	app: {
		title: 'Accounting app - Development environment'
	},

	server: {
		port: process.env.PORT || 8081
	},

	db : {
		url: 'mongodb://localhost/accounting_app-dev' // TODO extract url to a private file
	}

};


// Private functions ==========================================================

/**
 * Setup the database for testing
 */
function setupDB() {

	logger.debug('Setting up the Dev DB');

	// General ledger ---------------------------------------------------------

	var  GeneralLedger = require('../../app/models/generalLedger.model');

	logger.debug('removing all existing general ledger');
	GeneralLedger.remove(null).exec();

	var testingGeneralLedger = require('./dev/testingGeneralLedgersList');

	GeneralLedger.create(testingGeneralLedger, function(err) {

		if (err){

			logger.error('Error while creating the testing general ledgers');
			logger.error(err);

		}else {

			logger.debug('All testing general ledgers have been created');

			// Accounts -------------------------------------------------------

			var Account = require('../../app/models/account.model');

			logger.debug('removing all existing accounts');
			Account.remove(null).exec();

			var testingAccounts = require('./dev/testingAccountsList');

			Account.create(testingAccounts, function(err) {

				if (err){

					logger.error('Error while creating the testing accounts');
					logger.error(err);

				}else {

					logger.debug('All testing accounts have been created');

				}

			});

		}

	});

}


// Exported functions =========================================================

/**
 * [initEnv description]
 */
module.exports.initEnv = function() {

	logger.debug('Configuration initialization of dev environment');

};


/**
 * [initEnvPostDBConnection description]
 */
module.exports.initEnvPostDBConnection = function() {

	logger.debug('Post-DB connection configuration initialization of dev environment');
	setupDB();

};