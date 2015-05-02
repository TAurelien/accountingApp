/**
 *  @module   Account types Events
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, AccountTypes) {

	var logger = imports.logger.get('AccountTypes events');

	var prefix = 'accountTypes';

	return {

		/**
		 *  Emit a accountTypes.update event on AccountTypes.
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
			 *  @event AccountTypes#accountTypes.update
			 */
			AccountTypes.emit(eventName, updatedData, updatedIdArray);
		}

	};

};