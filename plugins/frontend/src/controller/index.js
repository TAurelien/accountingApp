/**
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-07-10
 *  @version  1.0.0
 */
'use strict';

var path = require('path');

module.exports = function (options, imports) {

	var logger = imports.logger.get('Frontend Ctrl');

	function returnPage(pageName, res) {

		logger.info('Rendering the', pageName, 'page');

		var indexFile = path.resolve(__dirname, '../public/app/core/views/' + pageName + '.html');

		res.sendFile(indexFile, function (err) {

			if (err) {
				logger.error('Error while sending the', pageName, 'page');
			}

		});

	}

	return {

		getIndex: function (req, res) {
			returnPage('index', res);
		}

	};

};