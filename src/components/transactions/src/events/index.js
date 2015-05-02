/**
 *  @module   Transactions Events
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, Transactions) {

	var logger = imports.logger.get('Transactions events');

	var prefix = 'transactions';

	return {

		/**
		 *  Emit a transactions.create event on Transactions.
		 *
		 *  @access   private
		 *  @author   TAurelien
		 *  @date     2015-05-02
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		emitCreate: function () {
			var eventName = prefix + '.create';
			logger.info('Emitting', eventName);
			/**
			 *  @event Transactions#transactions.create
			 */
			Transactions.emit(eventName);
		},

		/**
		 *  Emit a transactions.update event on Transactions.
		 *
		 *  @access   private
		 *  @author   TAurelien
		 *  @date     2015-05-02
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		emitUpdate: function () {
			var eventName = prefix + '.update';
			logger.info('Emitting', eventName);
			/**
			 *  @event Transactions#transactions.update
			 */
			Transactions.emit(eventName);
		},

		/**
		 *  Emit a transactions.delete event on Transactions.
		 *
		 *  @access   private
		 *  @author   TAurelien
		 *  @date     2015-05-02
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		emitDelete: function () {
			var eventName = prefix + '.delete';
			logger.info('Emitting', eventName);
			/**
			 *  @event Transactions#transactions.delete
			 */
			Transactions.emit(eventName);
		}

	};

};