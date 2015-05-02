/**
 *  @module   Nomenclatures
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

// Module dependencies ========================================================
var events = require('events');

module.exports = function setup(options, imports, register) {
	console.log();
	console.log('Registering the nomenclatures component module ...');

	/**
	 *  Nomenclatures
	 *
	 *  @class  Nomenclatures
	 *
	 *  @type  {Object}
	 */
	var Nomenclatures = new events.EventEmitter();

	var emitter = require('./events')(options, imports, Nomenclatures);
	require('./api')(options, imports, emitter, Nomenclatures);

	// Register --------------

	register(null, {
		nomenclatures: Nomenclatures
	});

};