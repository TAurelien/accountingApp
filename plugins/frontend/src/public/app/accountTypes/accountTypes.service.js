'use strict';

accountTypesModule.factory('AccountTypes', function () {

	var factory = {};

	// TODO To get from backend
	var types = [{
		code: 'equity'
	}, {
		code: 'asset'
	}, {
		code: 'liability'
	}, {
		code: 'income'
	}, {
		code: 'expense'
	}];

	factory.list = function () {
		return types;
	};

	return factory;

});