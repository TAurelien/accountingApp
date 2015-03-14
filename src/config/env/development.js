/** @module Env Dev */
'use strict';


// Module dependencies ========================================================
var logger = require(global.app.logger)('Env Dev');
var path   = require('path');


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

	logger.info('Setting up the Dev DB');

	// General ledger ---------------------------------------------------------

	// TODO Use async to organize the set up

	var  GeneralLedger = require(path.join(global.app.paths.modelsDir, './generalLedger.model'));

	logger.info('removing all existing general ledger');
	GeneralLedger.remove(null).exec();

	var testingGeneralLedger = require('./dev/testingGeneralLedgersList');

	GeneralLedger.create(testingGeneralLedger, function(err) {

		if (err){

			logger.error('Error while creating the testing general ledgers');
			logger.error(err);

		}else {

			logger.info('All testing general ledgers have been created');

			// Accounts -------------------------------------------------------

			var Account = require(path.join(global.app.paths.modelsDir,'./account.model'));

			logger.info('removing all existing accounts');
			Account.remove(null).exec();

			var testingAccounts = require('./dev/testingAccountsList');

			Account.create(testingAccounts, function(err) {

				if (err){

					logger.error('Error while creating the testing accounts');
					logger.error(err);

				} else {

					logger.info('All testing accounts have been created');

					// Transactions -------------------------------------------

					var Transaction = require(path.join(global.app.paths.modelsDir, '/transaction.model'));

					logger.info('Removing all existing transactions');
					Transaction.remove(null).exec();

					var testingTransactions = require('./dev/testingTransactionsList');

					Transaction.create(testingTransactions, function(err) {

						if (err) {

							logger.error('Error while creating the testing transactions');
							logger.error(err);

						} else {

							logger.info('All testing transactions have been created');

						}

					});

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

	logger.info('Configuration initialization of dev environment');

};


/**
 * [initEnvPostDBConnection description]
 */
module.exports.initEnvPostDBConnection = function() {

	logger.info('Post-DB connection configuration initialization of dev environment');
	setupDB();

};