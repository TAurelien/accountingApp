/**
 *  @module   Transactions
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

var events = require('events');

module.exports = function setup(options, imports, register) {
	console.log();
	console.log('Registering the transactions component module ...');

	var Transactions = new events.EventEmitter();

	var emitter = require('./events')(options, imports, Transactions);

	var model = require('./model');
	model.define(options, imports, emitter);

	require('./controller')(options, imports, emitter);

	var api = require('./api')(options, imports, emitter);

	Transactions.model = model.get();
	Transactions.api = api;

	// Register --------------

	register(null, {
		transactions: Transactions
	});

};