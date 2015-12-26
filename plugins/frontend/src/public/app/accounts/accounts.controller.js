/* jshint undef: false */
'use strict';

accountsModule.controller('accounts.infoCtrl', ['$stateParams', 'Accounts', '$scope',
	function($stateParams, Accounts, $scope) {

		var ctrl = this;
		ctrl.account = null;

		var id = $stateParams.accountId;
		var generalLedgerId = $stateParams.generalLedgerId;

		if (id) {

			Accounts.get(id).then(
				function(account) {
					ctrl.account = account;
				},
				function(response) {
					console.error(response);
				});

			var unregisterUpdatedEvent = Accounts.on(Accounts.events.UPDATED, function(updatedItem) {
				if (id === updatedItem.id) {
					ctrl.account = updatedItem;
				}
			});

			var unregisterBalanceChangedEvent = Accounts.on(Accounts.events.BALANCE_CHANGED, function(
				updatedItem) {
				if (id === updatedItem.id) {
					ctrl.account = updatedItem;
				}
			});

			$scope.$on('$destroy', function() {
				unregisterUpdatedEvent();
				unregisterBalanceChangedEvent();
			});

		}

	}
]);

accountsModule.controller('accounts.listCtrl', ['$stateParams', 'Accounts', '$scope',
	function($stateParams, Accounts, $scope) {

		var ctrl = this;
		ctrl.wait = true;
		ctrl.query = '';
		ctrl.sortType = 'name';
		ctrl.sortReverse = false;
		ctrl.list = [];

		var generalLedgerId = $stateParams.generalLedgerId;

		var refreshList = _.debounce(function() {
			Accounts.list(generalLedgerId).then(
				function(accounts) {
					ctrl.list = accounts;
					ctrl.wait = false;
				},
				function(response) {
					console.error(response);
				});
		}, 50);

		refreshList();

		var unregisterCreatedEvent = Accounts.on(Accounts.events.CREATED, function(createdItem) {
			refreshList();
		});

		var unregisterUpdatedEvent = Accounts.on(Accounts.events.UPDATED, function(updatedItem) {
			refreshList();
		});

		var unregisterDeletedEvent = Accounts.on(Accounts.events.DELETED, function(deletedItem) {
			refreshList();
		});

		var unregisterBalanceChangedEvent = Accounts.on(Accounts.events.BALANCE_CHANGED, function(
			updatedItem) {
			refreshList();
		});

		$scope.$on('$destroy', function() {
			unregisterCreatedEvent();
			unregisterUpdatedEvent();
			unregisterDeletedEvent();
			unregisterBalanceChangedEvent();
		});

	}
]);

accountsModule.controller('accounts.upsertCtrl', ['Currencies', 'AccountTypes', 'Accounts',
	'$stateParams', '$state', '$scope',
	function(Currencies, AccountTypes, Accounts, $stateParams, $state, $scope) {

		var ctrl = this;
		ctrl.data = {};
		var id = $stateParams.accountId;
		var generalLedgerId = $stateParams.generalLedgerId;

		ctrl.isCreation = (id) ? false : true;
		ctrl.currencies = Currencies.list();
		ctrl.accountTypes = AccountTypes.list();
		ctrl.accounts = [];

		var refreshAccountList = _.debounce(function() {
			Accounts.list(generalLedgerId).then(
				function(accounts) {
					ctrl.accounts = accounts;
				},
				function(response) {
					console.error(response);
				});
		}, 50);

		refreshAccountList();

		var unregisterCreatedEvent = Accounts.on(Accounts.events.CREATED, function(createdItem) {
			refreshAccountList();
		});

		var unregisterUpdatedEvent = Accounts.on(Accounts.events.UPDATED, function(updatedItem) {
			refreshAccountList();
			if (id === updatedItem.id) {
				// TODO Handle concurrent update
			}
		});

		var unregisterDeletedEvent = Accounts.on(Accounts.events.DELETED, function(deletedItem) {
			refreshAccountList();
			if (id === deletedItem.id) {
				// TODO Handle concurrent update/delete
			}
		});

		if (ctrl.isCreation) {

			ctrl.data = {
				generalLedger: generalLedgerId
			};

		} else {
			Accounts.get(id).then(
				function(account) {
					ctrl.data = account;
					ctrl.name = account.name;
					delete ctrl.data.balance;
					delete ctrl.data.ownBalance;
					delete ctrl.data.childBalance;
				},
				function(response) {
					console.error(response);
				});
		}

		function closeView() {
			ctrl.data = {};
			$state.go('^.list');
		}

		ctrl.upsert = function() {
			if (ctrl.isCreation) {
				Accounts.create(ctrl.data).then(
					function(createdAccount) {
						closeView();
					},
					function(response) {
						console.error(response);
					});
			} else {
				Accounts.update(id, ctrl.data).then(
					function(updatedAccount) {
						closeView();
					},
					function(response) {
						console.error(response);
					});
			}
		};

		$scope.$on('$destroy', function() {
			unregisterCreatedEvent();
			unregisterUpdatedEvent();
			unregisterDeletedEvent();
		});

	}
]);

accountsModule.controller('accounts.deleteCtrl', ['Accounts', '$state', '$stateParams',
	function(Accounts, $state, $stateParams) {

		var ctrl = this;
		var id = $stateParams.accountId;

		Accounts.get(id).then(
			function(account) {
				ctrl.name = account.name;
			},
			function(response) {
				console.error(response);
			});

		ctrl.delete = function() {
			Accounts.delete(id).then(
				function(deletedAccount) {
					$state.go('^.list');
				},
				function(response) {
					console.error(response);
				});
		};

	}
]);
