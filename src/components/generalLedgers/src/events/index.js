/**
 *  @module   General ledgers Events
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 */
'use strict';

var prefix = 'generalLedgers';

var events = {
	CREATED: prefix + '.created',
	UPDATED: prefix + '.updated',
	DELETED: prefix + '.deleted',
	NET_WORTH_CHANGED: prefix + '.net_worth_changed'
};

module.exports.events = events;

module.exports.emitter = function (options, imports, GeneralLedgers) {

	var logger = imports.logger.get('General Ledgers events');

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
		emitCreated: function (createdItem) {
			logger.info('Emitting', events.CREATED);
			/**
			 *  @event GeneralLedgers#generalLedgers.create
			 */
			GeneralLedgers.emit(events.CREATED, createdItem);
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
		emitUpdated: function (updatedItem) {
			logger.info('Emitting', events.UPDATED);
			/**
			 *  @event GeneralLedgers#generalLedgers.update
			 */
			GeneralLedgers.emit(events.UPDATED, updatedItem);
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
		emitDeleted: function (deletedItem) {
			logger.info('Emitting', events.DELETED);
			/**
			 *  @event GeneralLedgers#generalLedgers.delete
			 */
			GeneralLedgers.emit(events.DELETED, deletedItem);
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
		emitNetWorthChanged: function (item) {
			logger.info('Emitting', events.NET_WORTH_CHANGED);
			/**
			 *  @event GeneralLedgers#generalLedgers.netWorthChange
			 */
			GeneralLedgers.emit(events.NET_WORTH_CHANGED, item);
		}

	};

};