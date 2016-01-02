/* jshint undef: false */
'use strict';

accountsModule.controller('accounts.infoCtrl', ['$stateParams', 'Accounts', '$scope',
	function($stateParams, Accounts, $scope) {

		var ctrl = this;
		ctrl.account = null;

		ctrl.formatOptions = {
			classes: {
				positive: 'text-success',
				negative: 'text-danger',
				zero: 'text-success'
			}
		};

		var id = $stateParams.accountId;
		var generalLedgerId = $stateParams.generalLedgerId;

		if (id) {

			Accounts.get(id).then(
				function(account) {
					ctrl.account = account;

					if (ctrl.account.type === 'expense' || ctrl.account.type === 'liability') {
						ctrl.formatOptions.classes.positive = 'text-danger';
						ctrl.formatOptions.classes.negative = 'text-success';
					}

					// TODO Deal with acount charts in breadcrumbs
					ctrl.account.paths = [];
					ctrl.account.paths.push({
						name: ctrl.account.name,
						current: true
					});
				},
				function(response) {
					console.error(response);
				});

			var unregisterUpdatedEvent = Accounts.on(Accounts.events.UPDATED, function(event, updatedItem) {
				if (id === updatedItem.id) {
					ctrl.account = updatedItem;
				}
			});

			var unregisterBalanceChangedEvent = Accounts.on(Accounts.events.BALANCE_CHANGED, function(
				event, updatedItem) {
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

		var formatOptions = {
			classes: {
				positive: 'text-success',
				negative: 'text-danger',
				zero: 'text-success'
			}
		};
		var formatOptionsInverse = {
			classes: {
				positive: 'text-danger',
				negative: 'text-success',
				zero: 'text-success'
			}
		};

		var generalLedgerId = $stateParams.generalLedgerId;

		var refreshList = _.debounce(function() {
			Accounts.list(generalLedgerId).then(
				function(accounts) {
					ctrl.list = accounts;
					ctrl.wait = false;
					angular.forEach(ctrl.list, function(account) {
						if (account.type === 'liability' || account.type === 'expense') {
							account.formatOptions = formatOptionsInverse;
						} else {
							account.formatOptions = formatOptions;
						}
					});
				},
				function(response) {
					console.error(response);
				});
		}, 50);

		refreshList();

		var unregisterCreatedEvent = Accounts.on(Accounts.events.CREATED, function(event, createdItem) {
			refreshList();
		});

		var unregisterUpdatedEvent = Accounts.on(Accounts.events.UPDATED, function(event, updatedItem) {
			refreshList();
		});

		var unregisterDeletedEvent = Accounts.on(Accounts.events.DELETED, function(event, deletedItem) {
			refreshList();
		});

		var unregisterBalanceChangedEvent = Accounts.on(Accounts.events.BALANCE_CHANGED, function(
			event, updatedItem) {
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
		Currencies.list().then(
			function(currencies) {
				ctrl.currencies = currencies;
			},
			function(response) {
				console.error(response);
			}
		);
		AccountTypes.list().then(
			function(types) {
				ctrl.accountTypes = types;
			},
			function(response) {
				console.error(response);
			}
		);

		var unregisterCreatedEvent = Accounts.on(Accounts.events.CREATED, function(event, createdItem) {
			refreshAccountList();
		});

		var unregisterUpdatedEvent = Accounts.on(Accounts.events.UPDATED, function(event, updatedItem) {
			refreshAccountList();
			if (id === updatedItem.id) {
				// TODO Handle concurrent update
			}
		});

		var unregisterDeletedEvent = Accounts.on(Accounts.events.DELETED, function(event, deletedItem) {
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
