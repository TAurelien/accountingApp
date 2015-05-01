/**
 *  @module   Accounts Events
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, Accounts) {

	var logger = imports.logger.get('Accounts events');

	var prefix = 'accounts';

	return {

		/**
		 *  Emit a accounts.create event on Accounts.
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
			 *  @event Accounts#accounts.create
			 */
			Accounts.emit(eventName);
		},

		/**
		 *  Emit a accounts.update event on Accounts.
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
			 *  @event Accounts#accounts.update
			 */
			Accounts.emit(eventName);
		},

		/**
		 *  Emit a accounts.delete event on Accounts.
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
			 *  @event Accounts#accounts.delete
			 */
			Accounts.emit(eventName);
		},

		/**
		 *  Emit a accounts.balanceChange event on Accounts.
		 *
		 *  @access   private
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		emitBalanceChange: function () {
			var eventName = prefix + '.balanceChange';
			logger.info('Emitting', eventName);
			/**
			 *  @event Accounts#accounts.balanceChange
			 */
			Accounts.emit(eventName);
		}

	};

};