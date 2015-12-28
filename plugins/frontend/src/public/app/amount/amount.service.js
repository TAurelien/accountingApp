'use strict';

amountModule.factory('AmountFormatter', ['Currencies', function(Currencies) {

	var currencies = [];
	Currencies.all().then(
		function(allCurrencies) {
			currencies = allCurrencies;
		},
		function(response) {
			console.error(response);
		}
	);

	var getSymbol = function(currency) {
		if (currencies[currency]) {
			return currencies[currency].symbol;
		} else {
			return currency;
		}
	};

	var toString = Object.prototype.toString;

	function isString(obj) {
		return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
	}

	function isObject(obj) {
		return obj && toString.call(obj) === '[object Object]';
	}

	var defaultSettings = {
		formats: {
			positive: "%s %v",
			negative: "%s (%v)",
			zero: "%s %v",
			error: "-"
		},
		precision: 2,
		decimal: ".",
		thousand: ","
	};

	function checkPrecision(val, base) {
		val = Math.round(Math.abs(val));
		return isNaN(val) ? base : val;
	}

	function checkCurrencyFormat(format) {

		if (isString(format) && format.match("%v")) {
			return {
				positive: format,
				negative: format.replace("-", "").replace("%v", "-%v"),
				zero: format,
				error: defaultSettings.formats.error
			};
		} else if (!format || !format.positive || !format.positive.match("%v")) {
			return defaultSettings.formats;
		}
		return format;
	}

	function toFixed(value, precision) {
		var power = Math.pow(10, precision);
		return (Math.round(value * power) / power).toFixed(precision);
	}

	function formatNumber(number, precision, thousand, decimal) {

		precision = precision || defaultSettings.precision;
		decimal = decimal || defaultSettings.decimal;
		thousand = thousand || defaultSettings.thousand;

		var usePrecision = checkPrecision(precision);

		var negative = number < 0 ? "-" : "";
		var base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + "";
		var mod = base.length > 3 ? base.length % 3 : 0;

		var formatedNumber = '';
		formatedNumber += negative;
		formatedNumber += mod ? base.substr(0, mod) + thousand : "";
		formatedNumber += base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + thousand);
		formatedNumber += (usePrecision ? decimal + toFixed(Math.abs(number), usePrecision).split('.')[
			1] : "");

		return formatedNumber;

	}

	var factory = {};

	factory.format = function(amount, precision, decimal, thousand, format) {

		var formats = checkCurrencyFormat(format);

		var value = 0;
		var currency = '';
		var exactValue = 0;

		try {
			var scale = amount.scale;
			value = amount.value;
			currency = amount.currency;
			exactValue = value / scale;
		} catch (ex) {
			return formats.error;
		}

		var useFormat = value > 0 ? formats.positive : value < 0 ? formats.negative : formats.zero;

		var useSymbol = getSymbol(currency);
		var useValue = formatNumber(Math.abs(exactValue), precision, thousand, decimal);

		var formatedValue = '';
		formatedValue = useFormat.replace('%s', useSymbol);
		formatedValue = formatedValue.replace('%v', useValue);

		return formatedValue;

	};

	factory.formatError = defaultSettings.formats.error;

	return factory;
}]);
