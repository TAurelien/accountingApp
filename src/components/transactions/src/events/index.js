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

	// Inputs
	TO_CREATE: prefix + '.to_create',
	TO_GET: prefix + '.to_get',
	TO_LIST: prefix + '.to_list',
	TO_UPDATE: prefix + '.to_update',
	TO_DELETE: prefix + '.to_delete',
	TO_GET_AMOUNT: prefix + '.to_get_amount',

	// Outputs
	CREATED: prefix + '.created',
	GET: prefix + '.get',
	LIST: prefix + '.list',
	UPDATED: prefix + '.updated',
	DELETED: prefix + '.deleted',
	AMOUNT: prefix + '.amount'

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