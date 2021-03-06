/**
 * @module   General ledgers
 *
 * @access   public
 * @author   TAurelien
 * @date     2015-05-01
 * @version  1.0.0
 */
'use strict';

var events = require('events');

module.exports = function setup(options, imports, register) {
	console.log();
	console.log('Registering the generalLedgers component module ...');

	/**
	 *  General ledgers
	 *
	 *  @class  GeneralLedgers
	 *
	 *  @type  {events}
	 */
	var GeneralLedgers = new events.EventEmitter();
	GeneralLedgers.events = require('./events').events;
	var emitter = require('./events').emitter(options, imports, GeneralLedgers);

	var model = require('./model');
	model.define(options, imports, emitter);

	require('./controller')(options, imports, emitter, GeneralLedgers);

	var api = require('./api')(options, imports, emitter);

	GeneralLedgers.model = model.get();
	GeneralLedgers.api = api;

	// Register --------------

	register(null, {
		generalLedgers: GeneralLedgers
	});

};