/**
 *  @module   Accounts
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 */
'use strict';

var events = require('events');

module.exports = function setup(options, imports, register) {
	console.log();
	console.log('Registering the accounts component module ...');

	/**
	 *  Accounts
	 *
	 *  @class  Accounts
	 *
	 *  @type  {events}
	 */
	var Accounts = new events.EventEmitter();
	Accounts.events = require('./events').events;
	var emitter = require('./events').emitter(options, imports, Accounts);

	var model = require('./model');
	model.define(options, imports, emitter);

	require('./controller')(options, imports, emitter, Accounts);

	var api = require('./api')(options, imports, emitter);

	Accounts.model = model.get();
	Accounts.api = api;

	// Register --------------

	register(null, {
		accounts: Accounts
	});

};