/* jshint undef: false */
'use strict';

accountsModule.controller('accounts.infoCtrl', ['$stateParams', 'Accounts', '$scope',
	function ($stateParams, Accounts, $scope) {

		var ctrl = this;
		ctrl.account = null;

		var id = $stateParams.accountId;
		var generalLedgerId = $stateParams.generalLedgerId;

		if (id) {

			Accounts.get(id)
				.success(function (response) {
					ctrl.account = response.data;
				})
				.error(function (response) {
					console.log(response);
				});

			var handleUpdate = function (updatedItem) {
				console.log('Account update'); // TODO Remove console.log
				if (id === updatedItem.id) {
					console.log('handling account update of', updatedItem.id); // TODO Remove console.log
					ctrl.account = updatedItem;
				}
			};

			var handleBalanceChange = function (updatedItem) {
				console.log('Account balance update'); // TODO Remove console.log
				if (id === updatedItem.id) {
					console.log('handling account balance update of', updatedItem.id); // TODO Remove console.log
					ctrl.account = updatedItem;
				}
			};

			Accounts.on(Accounts.events.UPDATED, handleUpdate);
			Accounts.on(Accounts.events.BALANCE_CHANGED, handleBalanceChange);

			$scope.$on('$destroy', function () {
				Accounts.removeListener(Accounts.events.UPDATED, handleUpdate);
				Accounts.removeListener(Accounts.events.BALANCE_CHANGED, handleBalanceChange);
			});

		}

	}
]);

accountsModule.controller('accounts.listCtrl', ['$stateParams', 'Accounts', '$scope',
	function ($stateParams, Accounts, $scope) {

		var ctrl = this;
		ctrl.wait = true;
		ctrl.list = [];

		var generalLedgerId = $stateParams.generalLedgerId;

		var refreshList = _.debounce(function () {
			Accounts.list(generalLedgerId)
				.success(function (response) {
					ctrl.list = response.data;
					ctrl.wait = false;
				})
				.error(function (response) {
					console.log(response);
				});
		}, 50);

		refreshList();

		var handleCreation = function (createdItem) {
			refreshList();
		};

		var handleUpdate = function (updatedItem) {
			refreshList();
		};

		var handleDeletion = function (deletedItem) {
			refreshList();
		};

		var handleBalanceChange = function (updatedItem) {
			refreshList();
		};

		Accounts.on(Accounts.events.CREATED, handleCreation);
		Accounts.on(Accounts.events.UPDATED, handleUpdate);
		Accounts.on(Accounts.events.DELETED, handleDeletion);
		Accounts.on(Accounts.events.BALANCE_CHANGED, handleBalanceChange);

		$scope.$on('$destroy', function () {
			Accounts.removeListener(Accounts.events.CREATED, handleCreation);
			Accounts.removeListener(Accounts.events.UPDATED, handleUpdate);
			Accounts.removeListener(Accounts.events.DELETED, handleDeletion);
			Accounts.removeListener(Accounts.events.BALANCE_CHANGED, handleBalanceChange);
		});

	}
]);

accountsModule.controller('accounts.upsertCtrl', ['Currencies', 'AccountTypes', 'Accounts', '$stateParams', '$state', '$scope',
	function (Currencies, AccountTypes, Accounts, $stateParams, $state, $scope) {

		var ctrl = this;
		ctrl.data = {};
		var id = $stateParams.accountId;
		var generalLedgerId = $stateParams.generalLedgerId;

		ctrl.isCreation = (id) ? false : true;
		ctrl.currencies = Currencies.list();
		ctrl.accountTypes = AccountTypes.list();
		ctrl.accounts = [];

		var refreshAccountList = _.debounce(function () {
			Accounts.list(generalLedgerId)
				.success(function (response) {
					ctrl.accounts = response.data;
				})
				.error(function (response) {
					console.log(response);
				});
		}, 50);

		refreshAccountList();

		var handleCreation = function (createdItem) {
			refreshAccountList();
		};

		var handleUpdate = function (updatedItem) {
			refreshAccountList();
			if (id === updatedItem.id) {
				// TODO Handle concurrent update
			}
		};

		var handleDeletion = function (deletedItem) {
			refreshAccountList();
			if (id === deletedItem.id) {
				// TODO Handle concurrent update/delete
			}
		};

		Accounts.on(Accounts.events.CREATED, handleCreation);
		Accounts.on(Accounts.events.UPDATED, handleUpdate);
		Accounts.on(Accounts.events.DELETED, handleDeletion);

		if (ctrl.isCreation) {

			ctrl.data = {
				generalLedger: generalLedgerId
			};

		} else {
			Accounts.get(id)
				.success(function (response) {
					ctrl.data = response.data;
					ctrl.name = response.data.name;
					delete ctrl.data.balance;
					delete ctrl.data.ownBalance;
					delete ctrl.data.childBalance;
				})
				.error(function (response) {
					console.log(response);
				})
		}

		function closeView() {
			ctrl.data = {};
			$state.go('^.list');
		}

		ctrl.upsert = function () {
			if (ctrl.isCreation) {
				Accounts.create(ctrl.data)
					.success(function (response) {
						closeView();
					})
					.error(function (response) {
						console.log(response);
					});
			} else {
				Accounts.update(id, ctrl.data)
					.success(function (response) {
						closeView();
					})
					.error(function (response) {
						console.log(response);
					});
			}
		};

		$scope.$on('$destroy', function () {
			Accounts.removeListener(Accounts.events.CREATED, handleCreation);
			Accounts.removeListener(Accounts.events.UPDATED, handleUpdate);
			Accounts.removeListener(Accounts.events.DELETED, handleDeletion);
		});

	}
]);

accountsModule.controller('accounts.deleteCtrl', ['Accounts', '$state', '$stateParams',
	function (Accounts, $state, $stateParams) {

		var ctrl = this;
		var id = $stateParams.accountId;

		Accounts.get(id)
			.success(function (response) {
				ctrl.name = response.data.name;
			})
			.error(function (response) {
				console.log(response);
			});

		ctrl.delete = function () {
			Accounts.delete(id)
				.success(function (response) {
					$state.go('^.list');
				})
				.error(function (response) {
					console.log(response);
				});
		};

	}
]);