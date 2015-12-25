'use strict';

currenciesModule.factory('Currencies', function() {

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
		return currencies;
	};

	factory.list = function() {
		return currenciesArray;
	};

	return factory;

});
