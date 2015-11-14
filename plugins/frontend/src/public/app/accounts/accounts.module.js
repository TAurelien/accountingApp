'use strict';

var accountsModule = angular.module('coreApp.accounts', [
	'btford.socket-io',
	'coreApp.currencies',
	'coreApp.accountTypes',
	'coreApp.amount',
	'coreApp.generalLedgers'
]);