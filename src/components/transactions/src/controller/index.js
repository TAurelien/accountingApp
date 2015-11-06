/**
 *  @module   Transactions Controller
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, emitter, Transactions) {

	var api = require('../api')(options, imports, emitter);

	// Sockets management =====================================================

	require('./socket')(options, imports, api, Transactions);

	// REST API management ====================================================

	require('./restApi')(options, imports, api);

	//Backend events management ===============================================

	require('./events')(options, imports);

};