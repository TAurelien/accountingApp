'use strict';

amountModule.filter('AmountFormat', ['AmountFormatter', function (AmountFormatter) {

	return function (input, absolue, inverse, format) {
		// TODO check if input is an object to remove the try
		var formatedValue;
		try {
			var amount = {};
			amount.scale = input.scale;
			amount.currency = input.currency;
			if (absolue) {
				amount.value = Math.abs(input.value);
			} else if (inverse) {
				amount.value = -input.value;
			} else {
				amount.value = input.value;
			}

			format = format || {};

			formatedValue = AmountFormatter.format(amount, format.precision, format.decimal, format.thousand, format.format);
		} catch (ex) {
			formatedValue = AmountFormatter.formatError;
		}
		return formatedValue;
	};

}]);