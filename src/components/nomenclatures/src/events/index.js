/**
 *  @module   Nomenclatures Events
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, Nomenclatures) {

	var logger = imports.logger.get('Nomenclatures events');

	var prefix = 'nomenclatures';

	return {

		/**
		 *  Emit a nomenclatures.nomenclatureChange event on Nomenclatures.
		 *
		 *  @access   private
		 *  @author   TAurelien
		 *  @date     2015-05-02
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		emitNomenclatureChange: function (name) {
			var eventName = prefix + '.nomenclatureChange';
			logger.info('Emitting', eventName);
			/**
			 *  @event Nomenclatures#nomenclatures.nomenclatureChange
			 */
			Nomenclatures.emit(eventName, name);
		}

	};

};