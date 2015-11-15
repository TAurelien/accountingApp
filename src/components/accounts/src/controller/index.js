/**
 *  @module   Accounts Controller
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, emitter, Accounts) {

	var api = require('../api')(options, imports, emitter);

	// Sockets management =====================================================

	require('./socket')(options, imports, api, Accounts);

	// REST API management ====================================================

	require('./restApi')(options, imports, api);

	//Backend events management ===============================================

	require('./events')(options, imports, api);

};