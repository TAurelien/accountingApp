'use strict';

transactionsModule.factory('Transactions', ['socketFactory', '$http', function (socketFactory, $http) {

	var prefix = 'transactions';
	var restApiUrl = '/api/transactions';

	var factory = {};

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

	factory.on = function (eventName, callback) {
		socket.on(eventName, callback);
	};

	factory.removeListener = function (eventName, callback) {
		socket.removeListener(eventName, callback);
	};

	factory.get = function (id) {
		return $http.get(restApiUrl + '/' + id);
	};

	factory.list = function (accountId) {
		return $http.get(restApiUrl + '?accountId=' + accountId);
	};

	factory.create = function (data) {
		return $http.post(restApiUrl, data);
	};

	factory.update = function (id, data) {
		return $http.put(restApiUrl + '/' + id, data);
	};

	factory.delete = function (id) {
		return $http.delete(restApiUrl + '/' + id);
	};

	return factory;

}]);