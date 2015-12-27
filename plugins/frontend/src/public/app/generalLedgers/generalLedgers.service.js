/* jshint undef: false */
'use strict';

generalLedgersModule.factory('GeneralLedgers', ['socketFactory', '$http', '$q', '$rootScope',
	'$cacheFactory',
	function(socketFactory, $http, $q, $rootScope, $cacheFactory) {

		var prefix = 'generalLedgers';
		var restApiUrl = '/api/generalLedgers';

		var factory = {};

		var cacheId = 'GeneralLedgersCache';
		var cache = $cacheFactory.get(cacheId);
		if (angular.isUndefined(cache)) {
			cache = $cacheFactory(cacheId);
		}
		var generalLedgerlistCacheKey = 'list';

		// ==========================================================================

		var socket = socketFactory({
			prefix: '',
			ioSocket: io.connect()
		});

		var events = {
			CREATED: prefix + '.created',
			UPDATED: prefix + '.updated',
			DELETED: prefix + '.deleted',
			NET_WORTH_CHANGED: prefix + '.net_worth_changed'
		};

		factory.events = events;

		// ==========================================================================

		socket.on(events.CREATED, function(createdGeneralLedger) {
			var cacheGeneralLedgers = cache.get(generalLedgerlistCacheKey);
			if (!angular.isUndefined(cacheGeneralLedgers)) {
				cacheGeneralLedgers.push(createdGeneralLedger);
				cache.put(generalLedgerlistCacheKey, cacheGeneralLedgers);
			}
			$rootScope.$emit(events.CREATED, createdGeneralLedger);
		});

		socket.on(events.UPDATED, function(updatedGeneralLedger) {
			var cacheGeneralLedgers = cache.get(generalLedgerlistCacheKey);
			if (!angular.isUndefined(cacheGeneralLedgers)) {
				var index = _.findIndex(cacheGeneralLedgers, 'id', updatedGeneralLedger.id);
				if (index >= 0) {
					cacheGeneralLedgers[index] = updatedGeneralLedger;
					cache.put(generalLedgerlistCacheKey, cacheGeneralLedgers);
				}
			}
			$rootScope.$emit(events.UPDATED, updatedGeneralLedger);
		});

		socket.on(events.NET_WORTH_CHANGED, function(updatedGeneralLedger) {
			var cacheGeneralLedgers = cache.get(generalLedgerlistCacheKey);
			if (!angular.isUndefined(cacheGeneralLedgers)) {
				var index = _.findIndex(cacheGeneralLedgers, 'id', updatedGeneralLedger.id);
				if (index >= 0) {
					cacheGeneralLedgers[index] = updatedGeneralLedger;
					cache.put(generalLedgerlistCacheKey, cacheGeneralLedgers);
				}
			}
			$rootScope.$emit(events.NET_WORTH_CHANGED, updatedGeneralLedger);
		});

		socket.on(events.DELETED, function(deletedGeneralLedger) {
			var cacheGeneralLedgers = cache.get(generalLedgerlistCacheKey);
			if (!angular.isUndefined(cacheGeneralLedgers)) {
				_.remove(cacheGeneralLedgers, 'id', deletedGeneralLedger.id);
				cache.put(generalLedgerlistCacheKey, cacheGeneralLedgers);
			}
			$rootScope.$emit(events.DELETED, deletedGeneralLedger);
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

		factory.list = function() {
			var deferred = $q.defer();
			var cachedGeneralLedgers = cache.get(generalLedgerlistCacheKey);
			if (angular.isUndefined(cachedGeneralLedgers)) {
				$http.get(restApiUrl)
					.success(function(response) {
						var generalLedgers = response.data;
						deferred.resolve(generalLedgers);
						cache.put(generalLedgerlistCacheKey, generalLedgers);
					})
					.error(function(response) {
						deferred.reject(response);
					});
			} else {
				deferred.resolve(cachedGeneralLedgers);
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
