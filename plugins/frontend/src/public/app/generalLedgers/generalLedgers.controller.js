/* jshint undef: false */
'use strict';

generalLedgersModule.controller('generalLedgers.infoCtrl', ['$stateParams', 'GeneralLedgers',
	'$scope',
	function($stateParams, GeneralLedgers, $scope) {

		var ctrl = this;
		ctrl.generalLedger = null;

		var id = $stateParams.generalLedgerId;

		if (id) {

			GeneralLedgers.get(id).then(
				function(generalLedger) {
					ctrl.generalLedger = generalLedger;
				},
				function(response) {
					console.error(response);
				});

			var unregisterUpdatedEvent = GeneralLedgers.on(GeneralLedgers.events.UPDATED, function(event,
				updatedItem) {
				if (id === updatedItem.id) {
					ctrl.generalLedger = updatedItem;
				}
			});

			var unregisterNetWorthChangedEvent = GeneralLedgers.on(GeneralLedgers.events.NET_WORTH_CHANGED,
				function(event, updatedItem) {
					if (id === updatedItem.id) {
						ctrl.generalLedger = updatedItem;
					}
				});

			$scope.$on('$destroy', function() {
				unregisterUpdatedEvent();
				unregisterNetWorthChangedEvent();
			});

		}

	}
]);

generalLedgersModule.controller('generalLedgers.listCtrl', ['GeneralLedgers', '$scope',
	function(GeneralLedgers, $scope) {

		var ctrl = this;
		ctrl.query = '';
		ctrl.sortType = 'name';
		ctrl.sortReverse = false;
		ctrl.wait = true;
		ctrl.list = [];

		var refreshList = _.debounce(function() {
			GeneralLedgers.list().then(
				function(generalLedgers) {
					ctrl.list = generalLedgers;
					ctrl.wait = false;
				},
				function(response) {
					console.log(response);
				});
		}, 50);

		refreshList();

		var unregisterCreatedEvent = GeneralLedgers.on(GeneralLedgers.events.CREATED, function(
			event, createdItem) {
			refreshList();
		});

		var unregisterUpdatedEvent = GeneralLedgers.on(GeneralLedgers.events.UPDATED, function(
			event, updatedItem) {
			refreshList();
		});

		var unregisterDeletedEvent = GeneralLedgers.on(GeneralLedgers.events.DELETED, function(
			event, deletedItem) {
			refreshList();
		});

		var unregisterNetWorthChangedEvent = GeneralLedgers.on(GeneralLedgers.events.NET_WORTH_CHANGED,
			function(event, updatedItem) {
				refreshList();
			});

		$scope.$on('$destroy', function() {
			unregisterCreatedEvent();
			unregisterUpdatedEvent();
			unregisterDeletedEvent();
			unregisterNetWorthChangedEvent();
		});

	}
]);

generalLedgersModule.controller('generalLedger.upsertCtrl', ['GeneralLedgers', 'Currencies',
	'$state', '$stateParams', '$scope',
	function(GeneralLedgers, Currencies, $state, $stateParams, $scope) {

		var ctrl = this;
		ctrl.data = {};
		var id = $stateParams.generalLedgerId;
		ctrl.isCreation = (id) ? false : true;

		Currencies.list().then(
			function(currencies) {
				ctrl.currencies = currencies;
			},
			function(response) {
				console.error(response);
			}
		);

		if (!ctrl.isCreation) {

			GeneralLedgers.get(id).then(
				function(generalLedger) {
					ctrl.data = generalLedger;
					ctrl.name = generalLedger.name;
					delete ctrl.data.netWorth;
				},
				function(response) {
					console.log(response);
				});

			var unregisterUpdatedEvent = GeneralLedgers.on(GeneralLedgers.events.UPDATED, function(
				event, updatedItem) {
				if (id === updatedItem.id) {
					// TODO Handle concurrent update
				}
			});

			$scope.$on('$destroy', function() {
				unregisterUpdatedEvent();
			});

		}

		function closeView() {
			ctrl.data = {};
			$state.go('^.list');
		}

		ctrl.upsert = function() {
			if (ctrl.isCreation) {
				GeneralLedgers.create(ctrl.data).then(
					function(createdGeneralLedger) {
						closeView();
					},
					function(response) {
						console.log(response);
					});
			} else {
				GeneralLedgers.update(id, ctrl.data).then(
					function(updatedGeneralLedger) {
						closeView();
					},
					function(response) {
						console.log(response);
					});
			}
		};

	}
]);

generalLedgersModule.controller('generalLedger.deleteCtrl', ['GeneralLedgers', '$state',
	'$stateParams',
	function(GeneralLedgers, $state, $stateParams) {

		var ctrl = this;
		var id = $stateParams.generalLedgerId;

		GeneralLedgers.get(id).then(
			function(generalLedger) {
				ctrl.name = generalLedger.name;
			},
			function(response) {
				console.log(response);
			});

		ctrl.delete = function() {
			GeneralLedgers.delete(id).then(
				function(deletedGeneralLedger) {
					$state.go('^.list');
				},
				function(response) {
					console.log(response);
				});
		};

	}
]);
