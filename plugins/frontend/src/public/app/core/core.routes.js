'use strict';

app.config(
	['$stateProvider', '$urlRouterProvider', '$locationProvider',
		function($stateProvider, $urlRouterProvider, $locationProvider) {

			$urlRouterProvider.otherwise('/');

			$stateProvider.state('home', {
				url: '/',
				templateUrl: 'app/core/views/_home.html'
			});

			// General ledgers

			$stateProvider.state('generalLedgers', {
				abstract: true,
				url: '/generalLedgers',
				templateUrl: 'app/generalLedgers/views/_generalLedgers.html'
			});
			$stateProvider.state('generalLedgers.list', {
				url: '/list',
				templateUrl: 'app/generalLedgers/views/_generalLedgers.list.html'
			});
			$stateProvider.state('generalLedgers.create', {
				url: '/create',
				templateUrl: 'app/generalLedgers/views/_generalLedgers.upsert.html'
			});
			$stateProvider.state('generalLedgers.update', {
				url: '/:generalLedgerId/update',
				templateUrl: 'app/generalLedgers/views/_generalLedgers.upsert.html'
			});
			$stateProvider.state('generalLedgers.delete', {
				url: '/:generalLedgerId/delete',
				templateUrl: 'app/generalLedgers/views/_generalLedgers.delete.html'
			});

			// Accounts

			$stateProvider.state('generalLedgers.accounts', {
				abstract: true,
				url: '/:generalLedgerId/accounts',
				views: {
					"infoGeneralLedger@generalLedgers": {
						templateUrl: 'app/generalLedgers/views/_generalLedgers.info.html'
					},
					"": {
						templateUrl: 'app/accounts/views/_accounts.html'
					}
				}
			});
			$stateProvider.state('generalLedgers.accounts.list', {
				url: '/list',
				templateUrl: 'app/accounts/views/_accounts.list.html'
			});
			$stateProvider.state('generalLedgers.accounts.create', {
				url: '/create',
				templateUrl: 'app/accounts/views/_accounts.upsert.html'
			});
			$stateProvider.state('generalLedgers.accounts.update', {
				url: '/:accountId/update',
				templateUrl: 'app/accounts/views/_accounts.upsert.html'
			});
			$stateProvider.state('generalLedgers.accounts.delete', {
				url: '/:accountId/delete',
				templateUrl: 'app/accounts/views/_accounts.delete.html'
			});

			// Transactions

			$stateProvider.state('generalLedgers.accounts.transactions', {
				url: '/:accountId/transactions',
				views: {
					"": {
						templateUrl: 'app/transactions/views/_transactions.html'
					},
					"infoAccount@generalLedgers.accounts": {
						templateUrl: 'app/accounts/views/_accounts.info.html'
					}
				}
			});
			$stateProvider.state('generalLedgers.accounts.transactions.list', {
				url: '/list',
				templateUrl: 'app/transactions/views/_transactions.list.html'
			});
			$stateProvider.state('generalLedgers.accounts.transactions.create', {
				url: '/create',
				templateUrl: 'app/transactions/views/_transactions.upsert.html'
			});
			$stateProvider.state('generalLedgers.accounts.transactions.update', {
				url: '/:transactionId/update',
				templateUrl: 'app/transactions/views/_transactions.upsert.html'
			});
			$stateProvider.state('generalLedgers.accounts.transactions.duplicate', {
				url: '/:transactionId/duplicate',
				templateUrl: 'app/transactions/views/_transactions.upsert.html',
				data: {
					duplicate: true
				}
			});
			$stateProvider.state('generalLedgers.accounts.transactions.delete', {
				url: '/:transactionId/delete',
				templateUrl: 'app/transactions/views/_transactions.delete.html'
			});

			$locationProvider.html5Mode(true);

		}
	]);
