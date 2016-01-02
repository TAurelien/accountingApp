'use strict';

accountTypesModule.factory('AccountTypes', ['$q', function($q) {

	var factory = {};

	// TODO To get from backend
	var types = [{
		name: 'Equity',
		code: 'equity'
	}, {
		name: 'Asset',
		code: 'asset'
	}, {
		name: 'Liability',
		code: 'liability'
	}, {
		name: 'Income',
		code: 'income'
	}, {
		name: 'Expense',
		code: 'expense'
	}];

	factory.list = function() {
		var deferred = $q.defer();
		deferred.resolve(types);
		return deferred.promise;
	};

	return factory;
}]);
