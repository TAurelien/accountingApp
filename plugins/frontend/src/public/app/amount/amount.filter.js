'use strict';

amountModule.filter('AmountFormat', ['AmountFormatter', function(AmountFormatter) {

	return function(input, options) {
		// TODO check if input is an object to remove the try
		var formatedValue;
		try {
			options = options || {};
			var amount = {};
			amount.scale = input.scale;
			amount.currency = input.currency;
			if (options.absolue) {
				amount.value = Math.abs(input.value);
			} else if (options.inverse) {
				amount.value = -input.value;
			} else {
				amount.value = input.value;
			}

			var format = options.format || {};

			formatedValue = AmountFormatter.format(amount, format.precision, format.decimal, format.thousand,
				format.format);

			if (options.classes) {
				if (options.classes.zero && input.value === 0) {
					formatedValue = '<span class="' + options.classes.zero + '">' + formatedValue + '<span>';
				} else if (options.classes.positive && input.value > 0) {
					formatedValue = '<span class="' + options.classes.positive + '">' + formatedValue +
						'<span>';
				} else if (options.classes.negative) {
					formatedValue = '<span class="' + options.classes.negative + '">' + formatedValue +
						'<span>';
				}
			}
		} catch (ex) {
			formatedValue = AmountFormatter.formatError;
		}
		return formatedValue;
	};

}]);
