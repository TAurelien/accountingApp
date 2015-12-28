'use strict';

currenciesModule.factory('Currencies', ['$q', function($q) {

	var factory = {};

	// TODO To get from backend
	var currencies = {
		EUR: {
			code: 'EUR',
			symbol: '€'
		},
		USD: {
			code: 'USD',
			symbol: '$'
		}
	};

	var currenciesArray = [{
		code: 'EUR',
		symbol: '€'
	}, {
		code: 'USD',
		symbol: '$'
	}];

	factory.all = function() {
		var deferred = $q.defer();
		deferred.resolve(currencies);
		return deferred.promise;
	};

	factory.list = function() {
		var deferred = $q.defer();
		deferred.resolve(currenciesArray);
		return deferred.promise;
	};

	return factory;

}]);
