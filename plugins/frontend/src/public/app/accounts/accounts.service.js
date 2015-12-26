/* jshint undef: false */
'use strict';

accountsModule.factory('Accounts', ['socketFactory', '$http', '$q', '$rootScope', '$cacheFactory',
	function(socketFactory, $http, $q, $rootScope, $cacheFactory) {

		var prefix = 'accounts';
		var restApiUrl = '/api/accounts';

		var factory = {};

		var cacheId = 'AccountsCache';
		var cache = $cacheFactory.get(cacheId);
		if (angular.isUndefined(cache)) {
			cache = $cacheFactory(cacheId);
		}

		// ==========================================================================

		var socket = socketFactory({
			prefix: '',
			ioSocket: io.connect()
		});

		var events = {
			CREATED: prefix + '.created',
			UPDATED: prefix + '.updated',
			DELETED: prefix + '.deleted',
			BALANCE_CHANGED: prefix + '.balance_changed',
		};

		factory.events = events;

		// ==========================================================================

		socket.on(events.CREATED, function(createdAccount) {
			var generalLedgerId = createdAccount.generalLedger;
			var cachedAccounts = cache.get(generalLedgerId);
			if (!angular.isUndefined(cachedAccounts)) {
				cachedAccounts.push(createdAccount);
				cache.put(generalLedgerId, cachedAccounts);
			}
			$rootScope.$emit(events.CREATED, createdAccount);
		});

		socket.on(events.UPDATED, function(updatedAccount) {
			var generalLedgerId = updatedAccount.generalLedger;
			var cachedAccounts = cache.get(generalLedgerId);
			if (!angular.isUndefined(cachedAccounts)) {
				var index = _.findIndex(cachedAccounts, 'id', updatedAccount.id);
				if (index >= 0) {
					cachedAccounts[index] = updatedAccount;
					cache.put(generalLedgerId, cachedAccounts);
				}
			}
			$rootScope.$emit(events.UPDATED, updatedAccount);
		});

		socket.on(events.BALANCE_CHANGED, function(updatedAccount) {
			var generalLedgerId = updatedAccount.generalLedger;
			var cachedAccounts = cache.get(generalLedgerId);
			if (!angular.isUndefined(cachedAccounts)) {
				var index = _.findIndex(cachedAccounts, 'id', updatedAccount.id);
				if (index >= 0) {
					cachedAccounts[index] = updatedAccount;
					cache.put(generalLedgerId, cachedAccounts);
				}
			}
			$rootScope.$emit(events.BALANCE_CHANGED, updatedAccount);
		});

		socket.on(events.DELETED, function(deletedAccount) {
			var generalLedgerId = deletedAccount.generalLedger;
			var cachedAccounts = cache.get(generalLedgerId);
			if (!angular.isUndefined(cachedAccounts)) {
				_.remove(cachedAccounts, 'id', deletedAccount.id);
				cache.put(generalLedgerId, cachedAccounts);
			}
			$rootScope.$emit(events.DELETED, deletedAccount);
		});

		// ==========================================================================

		factory.on = function(eventName, callback) {
			return $rootScope.$on(eventName, callback);
		};

		// ==========================================================================

		factory.get = function(id) {
			var deferred = $q.defer();
			$http.get(restApiUrl + '/' + id)
				.success(function(response) {
					deferred.resolve(response.data);
				})
				.error(function(response) {
					deferred.reject(response);
				});
			return deferred.promise;
		};

		factory.list = function(generalLedgerId) {
			var deferred = $q.defer();
			var cachedAccounts = cache.get(generalLedgerId);
			if (angular.isUndefined(cachedAccounts)) {
				$http.get(restApiUrl + '?generalLedgerId=' + generalLedgerId)
					.success(function(response) {
						var accounts = response.data;
						deferred.resolve(accounts);
						cache.put(generalLedgerId, accounts);
					})
					.error(function(response) {
						deferred.reject(response);
					});
			} else {
				deferred.resolve(cachedAccounts);
			}
			return deferred.promise;
		};

		factory.create = function(data) {
			var deferred = $q.defer();
			$http.post(restApiUrl, data)
				.success(function(response) {
					deferred.resolve(response.data);
				})
				.error(function(response) {
					deferred.reject(response);
				});
			return deferred.promise;
		};

		factory.update = function(id, data) {
			var deferred = $q.defer();
			$http.put(restApiUrl + '/' + id, data)
				.success(function(response) {
					deferred.resolve(response.data);
				})
				.error(function(response) {
					deferred.reject(response);
				});
			return deferred.promise;
		};

		factory.delete = function(id) {
			var deferred = $q.defer();
			$http.delete(restApiUrl + '/' + id)
				.success(function(response) {
					deferred.resolve(response.data);
				})
				.error(function(response) {
					deferred.reject(response);
				});
			return deferred.promise;
		};

		// ==========================================================================

		return factory;
	}
]);
