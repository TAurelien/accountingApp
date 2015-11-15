/* jshint undef: false */
'use strict';

generalLedgersModule.controller('generalLedgers.infoCtrl', ['$stateParams', 'GeneralLedgers', '$scope',
	function ($stateParams, GeneralLedgers, $scope) {

		var ctrl = this;
		ctrl.generalLedger = null;

		var id = $stateParams.generalLedgerId;

		if (id) {

			GeneralLedgers.get(id)
				.success(function (response) {
					ctrl.generalLedger = response.data;
				})
				.error(function (response) {
					console.log(response);
				});

			var handleUpdate = function (updatedItem) {
				console.log('General ledger update '); // TODO Remove console.log
				if (id === updatedItem.id) {
					console.log('handling General ledger update of', updatedItem.id); // TODO Remove console.log
					ctrl.generalLedger = updatedItem;
				}
			};

			var handleNetWorthChange = function (updatedItem) {
				console.log('General ledger net worth update'); // TODO Remove console.log
				console.log(updatedItem); // TODO Remove console.log
				if (id === updatedItem.id) {
					console.log('handling General ledger net worth update of', updatedItem.id); // TODO Remove console.log
					ctrl.generalLedger = updatedItem;
				}
			};

			GeneralLedgers.on(GeneralLedgers.events.UPDATED, handleUpdate);
			GeneralLedgers.on(GeneralLedgers.events.NET_WORTH_CHANGED, handleNetWorthChange);

			$scope.$on('$destroy', function () {
				GeneralLedgers.removeListener(GeneralLedgers.events.UPDATED, handleUpdate);
				GeneralLedgers.removeListener(GeneralLedgers.events.NET_WORTH_CHANGED, handleNetWorthChange);
			});

		}

	}
]);

generalLedgersModule.controller('generalLedgers.listCtrl', ['GeneralLedgers', '$scope',
	function (GeneralLedgers, $scope) {

		var ctrl = this;
		ctrl.wait = true;
		ctrl.list = [];

		var refreshList = _.debounce(function () {
			GeneralLedgers.list()
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

		var handleNetWorthChange = function (updatedItem) {
			refreshList();
		};

		GeneralLedgers.on(GeneralLedgers.events.CREATED, handleCreation);
		GeneralLedgers.on(GeneralLedgers.events.UPDATED, handleUpdate);
		GeneralLedgers.on(GeneralLedgers.events.DELETED, handleDeletion);
		GeneralLedgers.on(GeneralLedgers.events.NET_WORTH_CHANGED, handleNetWorthChange);

		$scope.$on('$destroy', function () {
			GeneralLedgers.removeListener(GeneralLedgers.events.CREATED, handleCreation);
			GeneralLedgers.removeListener(GeneralLedgers.events.UPDATED, handleUpdate);
			GeneralLedgers.removeListener(GeneralLedgers.events.DELETED, handleDeletion);
			GeneralLedgers.removeListener(GeneralLedgers.events.NET_WORTH_CHANGED, handleNetWorthChange);
		});

	}
]);

generalLedgersModule.controller('generalLedger.upsertCtrl', ['GeneralLedgers', 'Currencies', '$state', '$stateParams', '$scope',
	function (GeneralLedgers, Currencies, $state, $stateParams, $scope) {

		var ctrl = this;
		ctrl.data = {};
		ctrl.currencies = Currencies.list();
		var id = $stateParams.generalLedgerId;
		ctrl.isCreation = (id) ? false : true;

		if (!ctrl.isCreation) {

			GeneralLedgers.get(id)
				.success(function (response) {
					ctrl.data = response.data;
					ctrl.name = response.data.name;
					delete ctrl.data.netWorth;
				})
				.error(function (response) {
					console.log(response);
				});

			var handleUpdate = function (updatedItem) {
				if (id === updatedItem.id) {
					// TODO Handle concurrent update
				}
			};

			GeneralLedgers.on(GeneralLedgers.events.UPDATED, handleUpdate);
			$scope.$on('$destroy', function () {
				GeneralLedgers.removeListener(GeneralLedgers.events.UPDATED, handleUpdate);
			});

		}

		function closeView() {
			ctrl.data = {};
			$state.go('^.list');
		}

		ctrl.upsert = function () {
			if (ctrl.isCreation) {
				GeneralLedgers.create(ctrl.data)
					.success(function (response) {
						closeView();
					})
					.error(function (response) {
						console.log(response);
					});
			} else {
				GeneralLedgers.update(id, ctrl.data)
					.success(function (response) {
						closeView();
					})
					.error(function (response) {
						console.log(response);
					});
			}
		};

	}
]);

generalLedgersModule.controller('generalLedger.deleteCtrl', ['GeneralLedgers', '$state', '$stateParams',
	function (GeneralLedgers, $state, $stateParams) {

		var ctrl = this;
		var id = $stateParams.generalLedgerId;

		GeneralLedgers.get(id)
			.success(function (response) {
				ctrl.name = response.data.name;
			})
			.error(function (response) {
				console.log(response);
			});

		ctrl.delete = function () {
			GeneralLedgers.delete(id)
				.success(function (response) {
					$state.go('^.list');
				})
				.error(function (response) {
					console.log(response);
				});
		};

	}
]);