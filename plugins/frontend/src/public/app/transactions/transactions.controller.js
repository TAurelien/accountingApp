/* jshint undef: false */
'use strict';

transactionsModule.controller('transactions.listCtrl', ['$stateParams', 'Transactions', '$scope',
	function($stateParams, Transactions, $scope) {

		var ctrl = this;
		ctrl.query = '';
		ctrl.sortType = 'date';
		ctrl.sortReverse = false;
		ctrl.wait = true;

		ctrl.accountId = $stateParams.accountId;
		ctrl.list = [];

		var refreshList = _.debounce(function() {
			Transactions.list(ctrl.accountId)
				.success(function(response) {
					ctrl.list = [];
					for (var i = 0; i < response.data.length; i++) {
						var transaction = response.data[i];
						transaction.valueDate = new Date(transaction.valueDate);
						for (var j = 0; j < transaction.splits.length; j++) {
							var split = transaction.splits[j];
							if (ctrl.accountId === split.account) {
								var transac = {};
								transac.id = transaction.id;
								transac.date = transaction.valueDate;
								transac.description = transaction.description;
								transac.amount = split.amount;
								if (split.amount.value < 0) {
									transac.debit = split.amount;
									transac.credit = null;
								} else {
									transac.credit = split.amount;
									transac.debit = null;
								}
								ctrl.list.push(transac);
							}
						}
					}
					ctrl.wait = false;
				})
				.error(function(response) {
					console.log(response);
				});
		}, 50);

		refreshList();

		var handleCreation = function(createdItem) {
			refreshList();
		};

		var handleUpdate = function(ûpdateditem) {
			refreshList();
		};

		var handleDeletion = function(createdItem) {
			refreshList();
		};

		Transactions.on(Transactions.events.CREATED, handleCreation);
		Transactions.on(Transactions.events.UPDATED, handleUpdate);
		Transactions.on(Transactions.events.DELETED, handleDeletion);

		$scope.$on('$destroy', function() {
			Transactions.removeListener(Transactions.events.CREATED, handleCreation);
			Transactions.removeListener(Transactions.events.UPDATED, handleUpdate);
			Transactions.removeListener(Transactions.events.DELETED, handleDeletion);
		});

	}
]);

transactionsModule.controller('transactions.upsertCtrl', ['Currencies', '$stateParams', '$state',
	'Transactions', 'Accounts', '$scope',
	function(Currencies, $stateParams, $state, Transactions, Accounts, $scope) {

		var ctrl = this;
		var id = $stateParams.transactionId;
		var generalLedgerId = $stateParams.generalLedgerId;
		var accountId = $stateParams.accountId;
		ctrl.currencies = Currencies.list();
		ctrl.accounts = [];
		ctrl.isCreation = (id) ? false : true;
		if (id) {
			ctrl.isCreation = false;
			if ($state.current.data && $state.current.data.duplicate) {
				ctrl.isUpdate = false;
				ctrl.isDuplicate = true;
			} else {
				ctrl.isUpdate = true;
				ctrl.isDuplicate = false;
			}
		} else {
			ctrl.isCreation = true;
			ctrl.isUpdate = false;
			ctrl.isDuplicate = false;
		}

		var refreshAccountList = _.debounce(function() {
			Accounts.list(generalLedgerId)
				.success(function(response) {
					ctrl.accounts = response.data;
				})
				.error(function(response) {
					console.log(response);
				});
		}, 50);

		refreshAccountList();

		var handleCreation = function(createdItem) {
			refreshAccountList();
		};

		var handleUpdate = function(updatedItem) {
			refreshAccountList();
		};

		var handleDeletion = function(deletedItem) {
			refreshAccountList();
		};

		Accounts.on(Accounts.events.CREATED, handleCreation);
		Accounts.on(Accounts.events.UPDATED, handleUpdate);
		Accounts.on(Accounts.events.DELETED, handleDeletion);

		if (ctrl.isCreation) {

			ctrl.data = {
				valueDate: new Date(),
				splits: [{
					account: accountId
				}, {
					account: null
				}]
			};

		} else {

			Transactions.get(id)
				.success(function(response) {
					ctrl.data = response.data;
					delete ctrl.data._id;
					delete ctrl.data.id;
					ctrl.data.valueDate = new Date(ctrl.data.valueDate);
					for (var j = 0; j < ctrl.data.splits.length; j++) {
						var split = ctrl.data.splits[j];
						if (split.amount.value < 0) {
							split.debit = -1 * split.amount.value / split.amount.scale;
							split.credit = null;
						} else {
							split.credit = split.amount.value / split.amount.scale;
							split.debit = null;
						}
						delete split.amount;
					}
				})
				.error(function(response) {
					console.log(response);
				});

			var handleTransactionUpdate = function(updatedItem) {
				if (id === updatedItem.id) {
					// TODO Handle concurrent update
				}
			};

			Transactions.on(Transactions.events.UPDATED, handleTransactionUpdate);
			$scope.$on('$destroy', function() {
				Transactions.removeListener(Transactions.events.UPDATED, handleTransactionUpdate);
			});

		}

		function closeView() {
			ctrl.data = {};
			$state.go('^.list');
		}

		ctrl.upsert = function() {

			for (var i = 0; i < ctrl.data.splits.length; i++) {
				var split = ctrl.data.splits[i];
				split.currency = 'EUR';
				var amount = {
					currency: split.currency,
					scale: 100
				}
				if (split.credit) {
					amount.value = split.credit * amount.scale;
					delete split.credit;
					delete split.debit;
				} else if (split.debit) {
					amount.value = -1 * split.debit * amount.scale;
					delete split.credit;
					delete split.debit;
				}
				split.amount = amount;
			}

			if (ctrl.isCreation || ctrl.isDuplicate) {
				Transactions.create(ctrl.data)
					.success(function(response) {
						closeView();
					})
					.error(function(response) {
						console.log(response);
					});
			} else {
				Transactions.update(id, ctrl.data)
					.success(function(response) {
						closeView();
					})
					.error(function(response) {
						console.log(response);
					});
			}

		};

		ctrl.addSplit = function() {
			ctrl.data.splits.push({});
		};

		ctrl.removeSplit = function(index) {
			if (ctrl.data.splits.length > 2) {
				ctrl.data.splits.splice(index, 1);
			}
		};

		$scope.$on('$destroy', function() {
			Accounts.removeListener(Accounts.events.CREATED, handleCreation);
			Accounts.removeListener(Accounts.events.UPDATED, handleUpdate);
			Accounts.removeListener(Accounts.events.DELETED, handleDeletion);
		});

	}
]);

transactionsModule.controller('transactions.deleteCtrl', ['$stateParams', '$state', 'Transactions',
	function($stateParams, $state, Transactions) {

		var ctrl = this;
		var id = $stateParams.transactionId;

		Transactions.get(id)
			.success(function(response) {
				ctrl.name = response.data.name;
			})
			.error(function(response) {
				console.log(response);
			});

		ctrl.delete = function() {
			Transactions.delete(id)
				.success(function(response) {
					$state.go('^.list');
				})
				.error(function(response) {
					console.log(response);
				});
		};

	}
]);
