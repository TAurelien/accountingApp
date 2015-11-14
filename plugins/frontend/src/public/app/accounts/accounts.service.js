/* jshint undef: false */
'use strict';

accountsModule.factory('Accounts', ['socketFactory', '$http', function (socketFactory, $http) {

	var prefix = 'accounts';
	var restApiUrl = '/api/accounts';

	var factory = {};

	var socket = socketFactory({
		prefix: '',
		ioSocket: io.connect() /**/
	});

	var events = {
		CREATED: prefix + '.created',
		UPDATED: prefix + '.updated',
		DELETED: prefix + '.deleted',
		BALANCE_CHANGED: prefix + '.balance_changed',
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

	factory.list = function (generalLedgerId) {
		return $http.get(restApiUrl + '?generalLedgerId=' + generalLedgerId);
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