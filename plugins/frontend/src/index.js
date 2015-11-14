/**
 *  @module   Frontend
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-07-10
 *  @version  1.0.0
 */
'use strict';

module.exports = function setup(options, imports, register) {
	console.log();
	console.log('Registering the frontend plugin ...');

	var routes = require('./routes')(options, imports);
	routes.define();

	// Register --------------

	register(null, {
		frontend: {}
	});

};