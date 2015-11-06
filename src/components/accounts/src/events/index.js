/**
 *  @module   Accounts Events
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 */
'use strict';

var prefix = 'accounts';

var events = {
	CREATED: prefix + '.created',
	UPDATED: prefix + '.updated',
	DELETED: prefix + '.deleted',
	BALANCE_CHANGED: prefix + '.balance_changed'
};

module.exports.events = events;

module.exports.emitter = function (options, imports, Accounts) {

	var logger = imports.logger.get('Accounts events');

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
		emitCreated: function (createdItem) {
			logger.info('Emitting', events.CREATED);
			/**
			 *  @event Accounts#accounts.create
			 */
			Accounts.emit(events.CREATED, createdItem);
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
		emitUpdated: function (updatedItem) {
			logger.info('Emitting', events.UPDATED);
			/**
			 *  @event Accounts#accounts.update
			 */
			Accounts.emit(events.UPDATED, updatedItem);
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
		emitDeleted: function (deletedItem) {
			logger.info('Emitting', events.DELETED);
			/**
			 *  @event Accounts#accounts.delete
			 */
			Accounts.emit(events.DELETED, deletedItem);
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
		emitBalanceChanged: function (item) {
			logger.info('Emitting', events.BALANCE_CHANGED);
			/**
			 *  @event Accounts#accounts.balanceChange
			 */
			Accounts.emit(events.BALANCE_CHANGED, item);
		}

	};

};