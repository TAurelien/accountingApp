var should = require('should');
var sinon = require('sinon');

var Schema = require('mongoose').Schema;
var moduleDef = require("../src/amounts");
var options = {};
var imports = {
	logger: {
		get: function (label) {
			'use strict';
			return {
				info: function (msg) {},
				debug: function (msg) {},
				error: function (msg) {}
			};
		}
	}
};

var amounts = null;

moduleDef(options, imports, function (err, exports) {
	'use strict';
	amounts = exports.amounts;
});

describe('Amount module', function () {
	'use strict';

	describe('amounts.schema', function () {

		it('should not be null', function () {
			should(amounts.schema).not.be.equal(null);
		});

		it('should be an instance of mongoose.Schema', function () {
			amounts.schema.should.be.an.instanceof(Schema);
		});

	});

	describe('Amount() object instanciated with no arguments', function () {

		var testAmount = new amounts.Amount();

		it('should have a property isAmountObject set to true', function () {
			testAmount.isAmountObject.should.be.equal(true);
		});

		it('should have a property preciseValue set to null', function () {
			should(testAmount.preciseValue).be.equal(null);
		});

		it('should have a property scale set to null', function () {
			should(testAmount.scale).be.equal(null);
		});

		it('should have a property currency set to null', function () {
			should(testAmount.currency).be.equal(null);
		});

		it('should have a function add()', function () {
			should(testAmount.add).be.of.type('function');
		});

		it('should have a function subtract()', function () {
			should(testAmount.subtract).be.of.type('function');
		});

		it('should have a function multiply()', function () {
			should(testAmount.multiply).be.of.type('function');
		});

		it('should have a function divide()', function () {
			should(testAmount.divide).be.of.type('function');
		});

		it('should have a function getValue()', function () {
			should(testAmount.getValue).be.of.type('function');
		});

		it('should have a function compareTo()', function () {
			should(testAmount.compareTo).be.of.type('function');
		});

		it('should have a function toString()', function () {
			should(testAmount.toString).be.of.type('function');
		});

	});

	describe('Amount(preciseValue, scale, currency) object instanciated with arguments', function () {

		var testAmount = new amounts.Amount(5000, 100, 'EUR');

		it('should have a property isAmountObject set to true', function () {
			testAmount.isAmountObject.should.be.equal(true);
		});

		it('should have a property preciseValue set to the argument value', function () {
			testAmount.preciseValue.should.be.equal(5000);
		});

		it('should have a property scale set to the argument value', function () {
			testAmount.scale.should.be.equal(100);
		});

		it('should have a property currency set to the argument value', function () {
			testAmount.currency.should.equal('EUR');
		});

		it('should have a function add()', function () {
			should(testAmount.add).be.of.type('function');
		});

		it('should have a function subtract()', function () {
			should(testAmount.subtract).be.of.type('function');
		});

		it('should have a function multiply()', function () {
			should(testAmount.multiply).be.of.type('function');
		});

		it('should have a function divide()', function () {
			should(testAmount.divide).be.of.type('function');
		});

		it('should have a function getValue()', function () {
			should(testAmount.getValue).be.of.type('function');
		});

		it('should have a function compareTo()', function () {
			should(testAmount.compareTo).be.of.type('function');
		});

		it('should have a function toString()', function () {
			should(testAmount.toString).be.of.type('function');
		});

	});

	describe('getValue() function', function () {

		it('should return a number representing the value', function () {
			var testAmount = new amounts.Amount(5000, 100, 'EUR');
			testAmount.getValue().should.be.exactly(50);
		});

		it('should return a number representing the value (with decimal)', function () {
			var testAmount = new amounts.Amount(5, 100, 'EUR');
			testAmount.getValue().should.be.exactly(0.05);
		});

		it('should throws an error if the precise value is not defined', function () {
			(function () {
				var testAmount = new amounts.Amount(null, 100, 'EUR');
				testAmount.getValue();
			}).should.throw('The precise value must be defined');
		});

		it('should throws an error if the scale is not defined', function () {
			var testAmount = new amounts.Amount(5000, null, 'EUR');
			(function () {
				testAmount.getValue();
			}).should.throw('The scale must be defined');
		});

		it('should throws an error if the scale equals 0', function () {
			(function () {
				var testAmount = new amounts.Amount(5000, 0, 'EUR');
				testAmount.getValue();
			}).should.throw('The scale must be different than 0');
		});

		it('should throws an error if the currency is not defined', function () {
			(function () {
				var testAmount = new amounts.Amount(5000, 100, null);
				testAmount.getValue();
			}).should.throw('The currency must be defined');
		});

	});

	describe('add(Amount) function', function () {

		it('should perform the operation (positive values)', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(1000, 100, 'EUR');
			testAmount_B.add(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(6000);
		});

		it('should perform the operation (negative values)', function () {
			var testAmount_A = new amounts.Amount(-5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(-1000, 100, 'EUR');
			testAmount_B.add(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(-6000);
		});

		it('should perform the operation (positive and negative values)', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(-1000, 100, 'EUR');
			testAmount_B.add(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(4000);
		});

		it('should perform the operation even if the precise value of the current is not defined', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(null, 100, 'EUR');
			testAmount_B.add(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(5000);
		});

		it('should inherit the scale from the argument if not defined in current', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(0, null, 'EUR');
			testAmount_B.add(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(5000);
			testAmount_B.scale.should.be.equal(100);
		});

		it('should inherit the currency from the argument if not defined in current', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(0, 100, null);
			testAmount_B.add(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(5000);
			testAmount_B.currency.should.equal('EUR');
		});

		it('should align the scale to the most restricting (current) impacting only the current', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(10000, 1000, 'EUR');
			testAmount_B.add(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(60000);
			testAmount_B.scale.should.be.equal(1000);
			testAmount_A.preciseValue.should.be.equal(5000);
			testAmount_A.scale.should.be.equal(100);
		});

		it('should align the scale to the most restricting (argument) impacting only the current', function () {
			var testAmount_A = new amounts.Amount(50000, 1000, 'EUR');
			var testAmount_B = new amounts.Amount(1000, 100, 'EUR');
			testAmount_B.add(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(60000);
			testAmount_B.scale.should.be.equal(1000);
		});

		it('should throws an error if both amounts don\'t have the same currency', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(0, 100, 'USD');
			(function () {
				testAmount_B.add(testAmount_A);
			}).should.throw('The currency of both amount must be similar');
		});

		it('should throws an error if the precise value of the argument is not defined', function () {
			(function () {
				var testAmount_A = new amounts.Amount(null, 100, 'EUR');
				var testAmount_B = new amounts.Amount(0, 100, 'EUR');
				testAmount_B.add(testAmount_A);
			}).should.throw('The precise value must be defined');
		});

		it('should throws an error if the scale of the argument is not defined', function () {
			(function () {
				var testAmount_A = new amounts.Amount(5000, null, 'EUR');
				var testAmount_B = new amounts.Amount(0, 100, 'EUR');
				testAmount_B.add(testAmount_A);
			}).should.throw('The scale must be defined');
		});

		it('should throws an error if the scale of the argument equals 0', function () {
			(function () {
				var testAmount_A = new amounts.Amount(5000, 0, 'EUR');
				var testAmount_B = new amounts.Amount(0, 100, 'EUR');
				testAmount_B.add(testAmount_A);
			}).should.throw('The scale must be different than 0');
		});

		it('should throws an error if the currency of the argument is not defined', function () {
			(function () {
				var testAmount_A = new amounts.Amount(5000, 100, null);
				var testAmount_B = new amounts.Amount(0, 100, 'EUR');
				testAmount_B.add(testAmount_A);
			}).should.throw('The currency must be defined');
		});

	});

	describe('subtract(Amount) function', function () {

		it('should perform the operation (positive values)', function () {
			var testAmount_A = new amounts.Amount(1000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(5000, 100, 'EUR');
			testAmount_B.subtract(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(4000);
		});

		it('should perform the operation (negative values)', function () {
			var testAmount_A = new amounts.Amount(-1000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(-5000, 100, 'EUR');
			testAmount_B.subtract(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(-4000);
		});

		it('should perform the operation (positive and negative values)', function () {
			var testAmount_A = new amounts.Amount(1000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(-5000, 100, 'EUR');
			testAmount_B.subtract(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(-6000);
		});

		it('should perform the operation even if the precise value of the current is not defined', function () {
			var testAmount_A = new amounts.Amount(1000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(null, 100, 'EUR');
			testAmount_B.subtract(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(-1000);
		});

		it('should inherit the scale from the argument if not defined in current', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(0, null, 'EUR');
			testAmount_B.subtract(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(-5000);
			testAmount_B.scale.should.be.equal(100);
		});

		it('should inherit the currency from the argument if not defined in current', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(0, 100, null);
			testAmount_B.subtract(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(-5000);
			testAmount_B.currency.should.equal('EUR');
		});

		it('should align the scale to the most restricting (current) impacting only the current', function () {
			var testAmount_A = new amounts.Amount(1000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(50000, 1000, 'EUR');
			testAmount_B.subtract(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(40000);
			testAmount_B.scale.should.be.equal(1000);
			testAmount_A.preciseValue.should.be.equal(1000);
			testAmount_A.scale.should.be.equal(100);
		});

		it('should align the scale to the most restricting (argument) impacting only the current', function () {
			var testAmount_A = new amounts.Amount(10000, 1000, 'EUR');
			var testAmount_B = new amounts.Amount(5000, 100, 'EUR');
			testAmount_B.subtract(testAmount_A);
			testAmount_B.preciseValue.should.be.equal(40000);
			testAmount_B.scale.should.be.equal(1000);
		});

		it('should throws an error if both amounts don\'t have the same currency', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(0, 100, 'USD');
			(function () {
				testAmount_B.subtract(testAmount_A);
			}).should.throw('The currency of both amount must be similar');
		});

		it('should throws an error if the precise value of the argument is not defined', function () {
			(function () {
				var testAmount_A = new amounts.Amount(null, 100, 'EUR');
				var testAmount_B = new amounts.Amount(0, 100, 'EUR');
				testAmount_B.subtract(testAmount_A);
			}).should.throw('The precise value must be defined');
		});

		it('should throws an error if the scale of the argument is not defined', function () {
			(function () {
				var testAmount_A = new amounts.Amount(5000, null, 'EUR');
				var testAmount_B = new amounts.Amount(0, 100, 'EUR');
				testAmount_B.subtract(testAmount_A);
			}).should.throw('The scale must be defined');
		});

		it('should throws an error if the scale of the argument equals 0', function () {
			(function () {
				var testAmount_A = new amounts.Amount(5000, 0, 'EUR');
				var testAmount_B = new amounts.Amount(0, 100, 'EUR');
				testAmount_B.subtract(testAmount_A);
			}).should.throw('The scale must be different than 0');
		});

		it('should throws an error if the currency of the argument is not defined', function () {
			(function () {
				var testAmount_A = new amounts.Amount(5000, 100, null);
				var testAmount_B = new amounts.Amount(0, 100, 'EUR');
				testAmount_B.subtract(testAmount_A);
			}).should.throw('The currency must be defined');
		});

	});

	describe('multiply(Number) function', function () {

		it('should multiply the precise value by the argument', function () {
			var testAmount = new amounts.Amount(5000, 100, 'EUR');
			testAmount.multiply(2);
			testAmount.preciseValue.should.be.equal(10000);
			testAmount.scale.should.be.equal(100);
		});

		it('should allow the operation whatever the scale and currency', function () {
			var testAmount = new amounts.Amount(5000, null, null);
			testAmount.multiply(2);
			testAmount.preciseValue.should.be.equal(10000);
			should(testAmount.scale).be.equal(null);
		});

		it('should throws an error if the precise value is not defined', function () {
			var testAmount = new amounts.Amount(null, 100, 'EUR');
			(function () {
				testAmount.multiply(2);
			}).should.throw('The precise value must be defined');
		});

		it('should throws an error if the argument is not a number', function () {
			var testAmount = new amounts.Amount(5000, 100, 'EUR');
			(function () {
				testAmount.multiply('');
			}).should.throw('The argument must be a number');
		});

	});

	describe('divide(Number) function', function () {

		it('should divide the precise value by the argument', function () {
			var testAmount = new amounts.Amount(5000, 100, 'EUR');
			testAmount.divide(2);
			testAmount.preciseValue.should.be.equal(2500);
			testAmount.scale.should.be.equal(100);
			testAmount.currency.should.be.equal('EUR');
		});

		it('should round the precise value to always get an integer', function () {
			var testAmount = new amounts.Amount(1000, 100, 'EUR');
			testAmount.divide(3);
			testAmount.preciseValue.should.be.equal(333);
			testAmount.preciseValue.should.not.be.equal(333.33);
		});

		it('should allow the operation whatever the scale and currency', function () {
			var testAmount = new amounts.Amount(5000, null, null);
			testAmount.divide(2);
			testAmount.preciseValue.should.be.equal(2500);
			should(testAmount.scale).be.equal(null);
		});

		it('should throws an error if the precise value is not defined', function () {
			var testAmount = new amounts.Amount(null, 100, 'EUR');
			(function () {
				testAmount.divide(2);
			}).should.throw('The precise value must be defined');
		});

		it('should throws an error the argument equals 0', function () {
			var testAmount = new amounts.Amount(5000, 100, 'EUR');
			(function () {
				testAmount.divide(0);
			}).should.throw('The argument must be different than 0');
		});

		it('should throws an error if the argument is not a number', function () {
			var testAmount = new amounts.Amount(5000, 100, 'EUR');
			(function () {
				testAmount.divide('');
			}).should.throw('The argument must be a number');
		});

	});

	describe('allow chaining on operation functions', function () {

		it('should perform the operations', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(0, 100, 'EUR');
			testAmount_B.add(testAmount_A).multiply(2).subtract(testAmount_A).divide(2);
			testAmount_B.getValue().should.be.exactly(25);
		});

	});

	describe('compareTo(Amount) function', function () {

		it('should return 0 if both values are equals', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var comparison = testAmount_A.compareTo(testAmount_A);
			comparison.should.be.equal(0);
		});

		it('should return 1 if the current is greater than the argument', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(0, 100, 'EUR');
			var comparison = testAmount_A.compareTo(testAmount_B);
			comparison.should.be.equal(1);
		});

		it('should return -1 if the argument is greater than the current', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(0, 100, 'EUR');
			var comparison = testAmount_B.compareTo(testAmount_A);
			comparison.should.be.equal(-1);
		});

		it('should throws an error if the current has something wrong', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(0, null, 'EUR');
			(function () {
				testAmount_B.compareTo(testAmount_A);
			}).should.throw();
		});

		it('should throws an error if the argument has something wrong', function () {
			var testAmount_A = new amounts.Amount(5000, null, 'EUR');
			var testAmount_B = new amounts.Amount(0, 100, 'EUR');
			(function () {
				testAmount_B.compareTo(testAmount_A);
			}).should.throw();
		});

		it('should throws an error if both amounts don\'t have the same currency', function () {
			var testAmount_A = new amounts.Amount(5000, 100, 'EUR');
			var testAmount_B = new amounts.Amount(0, 100, 'USD');
			(function () {
				testAmount_B.compareTo(testAmount_A);
			}).should.throw();
		});

	});

	describe('toString() function', function () {

		it('should return a string representing the value', function () {
			var testAmount = new amounts.Amount(5000, 100, 'EUR');
			testAmount.toString().should.be.exactly('50 EUR (5000 / 100)');
		});

	});

});