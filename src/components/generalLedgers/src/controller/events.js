'use strict';

var _ = require('lodash');

module.exports = function (options, imports, api) {

	var logger = imports.logger.get('General Ledgers ctrl - Events');
	var Accounts = imports.accounts;

	var delay = options.updateDelay || 50;

	var updateNetWorth = _.wrap(
		_.memoize(
			function () {
				return _.debounce(function (generalLedgerId) {
					api.updateNetWorth(generalLedgerId, function (err) {
						if (err) {
							logger.error('The update of net worth of the general ledger (' + generalLedgerId + ') impacted by the account has failed');
						} else {
							logger.info('The net worth of the general ledger (' + generalLedgerId + ') impacted by the account has been successfully updated');
						}
					});
				}, delay);
			}
		),
		function (func, generalLedgerId) {
			return func(generalLedgerId)(generalLedgerId);
		}
	);

	Accounts.on(Accounts.events.CREATED, function (createdItem) {
		logger.info('Handling a', Accounts.events.CREATED, 'event');
		var generalLedgerId = createdItem.generalLedger;
		if (generalLedgerId.toString) {
			generalLedgerId = generalLedgerId.toString();
		}
		updateNetWorth(generalLedgerId);
	});

	Accounts.on(Accounts.events.UPDATED, function (updatedItem) {
		logger.info('Handling a', Accounts.events.UPDATED, 'event');
		var generalLedgerId = updatedItem.generalLedger;
		if (generalLedgerId.toString) {
			generalLedgerId = generalLedgerId.toString();
		}
		updateNetWorth(generalLedgerId);
	});

	Accounts.on(Accounts.events.DELETED, function (deletedItem) {
		logger.info('Handling a', Accounts.events.DELETED, 'event');
		var generalLedgerId = deletedItem.generalLedger;
		if (generalLedgerId.toString) {
			generalLedgerId = generalLedgerId.toString();
		}
		updateNetWorth(generalLedgerId);
	});

	Accounts.on(Accounts.events.BALANCE_CHANGED, function (item) {
		logger.info('Handling a', Accounts.events.BALANCE_CHANGED, 'event');
		var generalLedgerId = item.generalLedger;
		if (generalLedgerId.toString) {
			generalLedgerId = generalLedgerId.toString();
		}
		updateNetWorth(generalLedgerId);
	});

};