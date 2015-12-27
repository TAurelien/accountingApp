/* jshint undef: false */
'use strict';

transactionsModule.factory('Transactions', ['socketFactory', '$http', '$q', '$rootScope',
	'$cacheFactory',
	function(socketFactory, $http, $q, $rootScope, $cacheFactory) {

		var prefix = 'transactions';
		var restApiUrl = '/api/transactions';

		var factory = {};

		var cacheId = 'TransactionsCache';
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
		};

		factory.events = events;

		// ==========================================================================

		socket.on(events.CREATED, function(createdTransaction) {
			for (var i = 0; i < createdTransaction.splits.length; i++) {
				var split = createdTransaction.splits[i];
				var accountId = split.account;
				var cachedTransactions = cache.get(accountId);
				if (!angular.isUndefined(cachedTransactions)) {
					cachedTransactions.push(createdTransaction);
					cache.put(accountId, cachedTransactions);
				}
			}
			$rootScope.$emit(events.CREATED, createdTransaction);
		});

		socket.on(events.UPDATED, function(updatedTransaction) {
			for (var i = 0; i < updatedTransaction.splits.length; i++) {
				var split = updatedTransaction.splits[i];
				var accountId = split.account;
				var cachedTransactions = cache.get(accountId);
				if (!angular.isUndefined(cachedTransactions)) {
					var index = _.findIndex(cachedTransactions, 'id', updatedTransaction.id);
					if (index >= 0) {
						cachedTransactions[index] = updatedTransaction;
						cache.put(accountId, cachedTransactions);
					}
				}
			}
			$rootScope.$emit(events.UPDATED, updatedTransaction);
		});

		socket.on(events.DELETED, function(deletedTransaction) {
			for (var i = 0; i < deletedTransaction.splits.length; i++) {
				var split = deletedTransaction.splits[i];
				var accountId = split.account;
				var cachedTransactions = cache.get(accountId);
				if (!angular.isUndefined(cachedTransactions)) {
					_.remove(cachedTransactions, 'id', deletedTransaction.id);
					cache.put(accountId, cachedTransactions);
				}
			}
			$rootScope.$emit(events.DELETED, deletedTransaction);
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

		factory.list = function(accountId) {
			var deferred = $q.defer();
			var cachedTransactions = cache.get(accountId);
			if (angular.isUndefined(cachedTransactions)) {
				$http.get(restApiUrl + '?accountId=' + accountId)
					.success(function(response) {
						var transactions = response.data;
						deferred.resolve(transactions);
						cache.put(accountId, transactions);
					})
					.error(function(response) {
						deferred.reject(response);
					});
			} else {
				deferred.resolve(cachedTransactions);
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
