'use strict';

var transactionsModule = angular.module('coreApp.transactions', [
	'btford.socket-io',
	'coreApp.currencies',
	'coreApp.amount',
	'coreApp.generalLedgers',
	'coreApp.accounts'
]);