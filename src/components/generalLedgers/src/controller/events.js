'use strict';

module.exports = function (options, imports, api) {

	var logger = imports.logger.get('General Ledgers ctrl - Events');
	var Accounts = imports.accounts;

	var handleAccount = function (account) {
		var accountId = account.id;
		if (account.generalLedger && account.generalLedger.toString) {
			var generalLedgerId = account.generalLedger.toString();
			api.updateNetWorth(generalLedgerId, function (err) {
				if (err) {
					logger.error('The update of net worth of the general ledger (', generalLedgerId, ') impacted by the account(', accountId, ') has failed');
				} else {
					logger.info('The net worth of the general ledger (', generalLedgerId, ') impacted by the account(', accountId, ') has been successfully updated');
				}
			});
		}
	};

	Accounts.on(Accounts.events.CREATED, function (createdItem) {
		logger.info('Handling a', Accounts.events.CREATED, 'event');
		handleAccount(createdItem);
	});

	Accounts.on(Accounts.events.UPDATED, function (updatedItem) {
		logger.info('Handling a', Accounts.events.UPDATED, 'event');
		handleAccount(updatedItem);
	});

	Accounts.on(Accounts.events.DELETED, function (deletedItem) {
		logger.info('Handling a', Accounts.events.DELETED, 'event');
		handleAccount(deletedItem);
	});

	Accounts.on(Accounts.events.BALANCE_CHANGED, function (item) {
		logger.info('Handling a', Accounts.events.BALANCE_CHANGED, 'event');
		handleAccount(item);
	});

};