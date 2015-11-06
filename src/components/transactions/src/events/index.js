/**
 *  @module   Transactions Events
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

var prefix = 'transactions';

var events = {
	CREATED: prefix + '.created',
	UPDATED: prefix + '.updated',
	DELETED: prefix + '.deleted',
};

module.exports.events = events;

module.exports.emitter = function (options, imports, Transactions) {

	var logger = imports.logger.get('Transactions events');

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
		emitCreated: function (createdItem) {
			logger.info('Emitting', events.CREATED);
			/**
			 *  @event Transactions#transactions.create
			 */
			Transactions.emit(events.CREATED, createdItem);
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
		emitUpdated: function (updatedItem) {
			logger.info('Emitting', events.UPDATED);
			/**
			 *  @event Transactions#transactions.update
			 */
			Transactions.emit(events.UPDATED, updatedItem);
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
		emitDeleted: function (deletedItem) {
			logger.info('Emitting', events.DELETED);
			/**
			 *  @event Transactions#transactions.delete
			 */
			Transactions.emit(events.DELETED, deletedItem);
		}

	};

};