/**
 *  @module   Currencies Events
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, Currencies) {

	var logger = imports.logger.get('Currencies events');

	var prefix = 'currencies';

	return {

		/**
		 *  Emit a currencies.update event on Currencies.
		 *
		 *  @access   private
		 *  @author   TAurelien
		 *  @date     2015-05-02
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		emitUpdate: function (updatedData, updatedIdArray) {
			var eventName = prefix + '.update';
			logger.info('Emitting', eventName);
			/**
			 *  @event Currencies#currencies.update
			 */
			Currencies.emit(eventName, updatedData, updatedIdArray);
		}

	};

};