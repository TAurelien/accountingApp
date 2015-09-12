/**
 *  @module   General ledgers Events
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, GeneralLedgers) {

	var logger = imports.logger.get('General Ledgers events');
	var IO = imports.io;
	var prefix = 'generalLedgers';

	return {

		/**
		 *  Emit a generalLedgers.create event on GeneralLedgers.
		 *
		 *  @access   private
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		emitCreate: function () {
			var eventName = prefix + '.create';
			logger.info('Emitting', eventName);
			/**
			 *  @event GeneralLedgers#generalLedgers.create
			 */
			GeneralLedgers.emit(eventName);
			//IO.emit(prefix + '.created', err, createdItem);
		},

		/**
		 *  Emit a generalLedgers.update event on GeneralLedgers.
		 *
		 *  @access   private
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		emitUpdate: function () {
			var eventName = prefix + '.update';
			logger.info('Emitting', eventName);
			/**
			 *  @event GeneralLedgers#generalLedgers.update
			 */
			GeneralLedgers.emit(eventName);
			//IO.emit(prefix + '.updated', err, updatedItem);
		},

		/**
		 *  Emit a generalLedgers.delete event on GeneralLedgers.
		 *
		 *  @access   private
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		emitDelete: function () {
			var eventName = prefix + '.delete';
			logger.info('Emitting', eventName);
			/**
			 *  @event GeneralLedgers#generalLedgers.delete
			 */
			GeneralLedgers.emit(eventName);
			//IO.emit(prefix + '.deleted', err);
		},

		/**
		 *  Emit a generalLedgers.netWorthChange event on GeneralLedgers.
		 *
		 *  @access   private
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		emitNetWorthChange: function () {
			var eventName = prefix + '.netWorthChange';
			logger.info('Emitting', eventName);
			/**
			 *  @event GeneralLedgers#generalLedgers.netWorthChange
			 */
			GeneralLedgers.emit(eventName);
			//IO.emit(prefix + '.netWorthChanged', err);
		}

	};

};