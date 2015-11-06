'use strict';

module.exports = function (options, imports) {

	var logger = imports.logger.get('Accounts ctrl - Events');
	var Transactions = imports.transactions;

	Transactions.on(Transactions.events.CREATED, function (createdItem) {
		logger.info('Handling a', Transactions.events.CREATED, 'event');
		logger.debug('A transaction has been created, I should update the corresponding accounts');
		logger.debug(createdItem.id);
	});

	Transactions.on(Transactions.events.UPDATED, function (updatedItem) {
		logger.info('Handling a', Transactions.events.UPDATED, 'event');
		logger.debug('A transaction has been updated, I should update the corresponding accounts');
		logger.debug(updatedItem.id);
	});

	Transactions.on(Transactions.events.DELETED, function (deletedItem) {
		logger.info('Handling a', Transactions.events.DELETED, 'event');
		logger.debug('A transaction has been deleted, I should update the corresponding accounts');
		logger.debug(deletedItem.id);
	});

};