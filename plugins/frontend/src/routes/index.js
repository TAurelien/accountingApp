/**
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-07-10
 *  @version  1.0.0
 */
'use strict';

var path = require('path');
var express

module.exports = function (options, imports) {

	var logger = imports.logger.get('Frontend routes');

	var server = imports.express;
	var app = server.app;
	var express = server.express;
	var ctrl = require('../controller')(options, imports);

	return {

		define: function () {
			server.addPublicFolder(path.resolve(__dirname, '../public'));

			var frontendRoute = express.Router();
			frontendRoute.get('*', ctrl.getIndex);
			server.addRoute('*', frontendRoute, 999);
		}

	};

};