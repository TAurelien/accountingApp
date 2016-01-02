/* jshint undef: false */
'use strict';

transactionsModule.controller('transactions.listCtrl', ['$stateParams', 'Transactions', 'Accounts',
	'$scope',
	function($stateParams, Transactions, Accounts, $scope) {

		var ctrl = this;
		ctrl.query = '';
		ctrl.sortType = 'date';
		ctrl.sortReverse = false;
		ctrl.wait = true;

		ctrl.amountFormatOptions = {
			absolue: false,
			inverse: true,
			classes: {
				positive: 'text-success',
				negative: 'text-danger',
				zero: 'text-success'
			}
		};
		ctrl.creditFormatOptions = {
			absolue: true,
			inverse: false,
			classes: {
				positive: 'text-success',
				negative: 'text-danger',
				zero: 'text-success'
			}
		};
		ctrl.debitFormatOptions = {
			absolue: true,
			inverse: false,
			classes: {
				positive: 'text-success',
				negative: 'text-danger',
				zero: 'text-success'
			}
		};

		ctrl.accountId = $stateParams.accountId;
		Accounts.get(ctrl.accountId).then(
			function(account) {
				ctrl.account = account;
				if (ctrl.account.type === 'asset' || ctrl.account.type === 'liability') {
					ctrl.amountFormatOptions.classes.positive = 'text-danger';
					ctrl.amountFormatOptions.classes.negative = 'text-success';
					ctrl.creditFormatOptions.classes.positive = 'text-danger';
					ctrl.creditFormatOptions.classes.negative = 'text-success';
					ctrl.debitFormatOptions.classes.positive = 'text-danger';
					ctrl.debitFormatOptions.classes.negative = 'text-success';
				}
			},
			function(response) {
				console.error(response);
			}
		);

		ctrl.generalLedgerId = $stateParams.generalLedgerId;
		ctrl.list = [];

		var refreshList = _.debounce(function() {
			Transactions.list(ctrl.accountId).then(
				function(transactions) {
					ctrl.list = [];
					for (var i = 0; i < transactions.length; i++) {
						var transaction = transactions[i];
						transaction.valueDate = new Date(transaction.valueDate);
						var transacs = [];
						var account = null;
						for (var j = 0; j < transaction.splits.length; j++) {
							var transac = {};
							var split = transaction.splits[j];
							if (ctrl.accountId === split.account) {
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
								transacs.push(transac);
							} else {
								if (account) {
									account = {
										name: '[Several accounts]'
									};
								} else {
									account = {
										id: split.account,
										name: split.account
									};
								}
							}
						}
						if (transacs.length > 0) {
							for (var k = 0; k < transacs.length; k++) {
								var transac = transacs[k];
								transac.account = account;
								ctrl.list.push(transac);
							}
						}
					}
					ctrl.wait = false;
					Accounts.list(ctrl.generalLedgerId).then(
						function(accounts) {
							for (var i = 0; i < ctrl.list.length; i++) {
								var accountId = ctrl.list[i].account.id;
								if (accountId) {
									var name = _.result(_.find(accounts, 'id', accountId), 'name');
									ctrl.list[i].account.name = name;
								}
							}
						},
						function(response) {
							console.error(response);
						}
					);
				},
				function(response) {
					console.error(response);
				});
		}, 50);

		refreshList();

		var unregisterCreatedEvent = Transactions.on(Transactions.events.CREATED, function(event,
			createdItem) {
			refreshList();
		});

		var unregisterUpdatedEvent = Transactions.on(Transactions.events.UPDATED, function(event,
			updateditem) {
			refreshList();
		});

		var unregisterDeletedEvent = Transactions.on(Transactions.events.DELETED, function(event,
			createdItem) {
			refreshList();
		});

		$scope.$on('$destroy', function() {
			unregisterCreatedEvent();
			unregisterUpdatedEvent();
			unregisterDeletedEvent();
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
		Currencies.list().then(
			function(currencies) {
				ctrl.currencies = currencies;
			},
			function(response) {
				console.error(response);
			}
		);

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
			Accounts.list(generalLedgerId).then(
				function(accounts) {
					ctrl.accounts = accounts;
				},
				function(response) {
					console.error(response);
				});
		}, 50);

		refreshAccountList();

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
				valueDate: new Date(),
				splits: [{
					account: accountId
				}, {
					account: null
				}]
			};

		} else {

			Transactions.get(id).then(
				function(account) {
					ctrl.data = account;
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
				},
				function(response) {
					console.error(response);
				});

			var unregisterUpdatedTransactionEvent = Transactions.on(Transactions.events.UPDATED, function(
				event,
				updatedItem) {
				if (id === updatedItem.id) {
					// TODO Handle concurrent update
				}
			});

			$scope.$on('$destroy', function() {
				unregisterUpdatedTransactionEvent();
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
				Transactions.create(ctrl.data).then(
					function(createdTransaction) {
						closeView();
					},
					function(response) {
						console.error(response);
					});
			} else {
				Transactions.update(id, ctrl.data).then(
					function(updatedTransaction) {
						closeView();
					},
					function(response) {
						console.error(response);
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
			unregisterCreatedEvent();
			unregisterUpdatedEvent();
			unregisterDeletedEvent();
		});

	}
]);

transactionsModule.controller('transactions.deleteCtrl', ['$stateParams', '$state', 'Transactions',
	function($stateParams, $state, Transactions) {

		var ctrl = this;
		var id = $stateParams.transactionId;

		Transactions.get(id).then(
			function(transaction) {
				ctrl.name = transaction.name;
			},
			function(response) {
				console.error(response);
			});

		ctrl.delete = function() {
			Transactions.delete(id).then(
				function(deletedTransaction) {
					$state.go('^.list');
				},
				function(response) {
					console.error(response);
				});
		};

	}
]);
