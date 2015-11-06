'use strict';

module.exports = function (options, imports) {

	var logger = imports.logger.get('General Ledgers ctrl - Events');
	var Accounts = imports.accounts;

	Accounts.on(Accounts.events.CREATED, function (createdItem) {
		logger.info('Handling a', Accounts.events.CREATED, 'event');
		logger.debug('An account has been created, I should update the corresponding general ledger');
		logger.debug(createdItem.id);
	});

	Accounts.on(Accounts.events.UPDATED, function (updatedItem) {
		logger.info('Handling a', Accounts.events.UPDATED, 'event');
		logger.debug('An account has been updated, I should update the corresponding general ledger');
		logger.debug(updatedItem.id);
	});

	Accounts.on(Accounts.events.DELETED, function (deletedItem) {
		logger.info('Handling a', Accounts.events.DELETED, 'event');
		logger.debug('An account has been deleted, I should update the corresponding general ledger');
		logger.debug(deletedItem.id);
	});

	Accounts.on(Accounts.events.BALANCE_CHANGED, function (item) {
		logger.info('Handling a', Accounts.events.BALANCE_CHANGED, 'event');
		logger.debug('The balance of an account has been changed, I should update the corresponding general ledger');
		logger.debug(item.id);
	});

};