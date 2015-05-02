/**
 *  @module   Nomenclatures API
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

module.exports = function (options, imports, emitter, Nomenclatures) {

	var logger = imports.logger.get('Nomenclatures API');

	/**
	 *  Hold all nomenclatures data.
	 *
	 *  @access private
	 *  @type  {Object}
	 */
	Nomenclatures._data = {};

	/**
	 *  Add a new nomenclature to the application.
	 *
	 *  @param    {String}    name             The name of the nomenclature.
	 *  @param    {Array}     data             The list of data
	 *  @param    {Array}     idArray          The list of id/code only used for reference.
	 *  @param    {Object}    Nomenclature     The EventEmitter inherited object of the nomenclature to listen, then update changes on data.
	 *  @param    {String}    updateEventName  The name of the data update event to listen.
	 *
	 *  @fires    Nomenclatures#nomenclatures.nomenclatureChange
	 *
	 *  @access   public
	 *  @author   TAurelien
	 *  @date     2015-05-02
	 *  @version  1.0.0
	 *  @since    1.0.0
	 */
	Nomenclatures.addNomenclature = function (name, data, idArray, Nomenclature, updateEventName) {
		logger.info('Adding a new nomenclature:', name);
		this._data[name] = {
			data: data,
			idArray: idArray
		};
		Nomenclature.on(updateEventName, function (updatedData, updatedIdArray) {
			logger.info('Updating the nomenclature', name);
			Nomenclatures._data[name] = {
				data: updatedData,
				idArray: updatedIdArray
			};
			emitter.emitNomenclatureChange(name);
		});
	};

	/**
	 *  Get the list of data of a specific nomenclature.
	 *
	 *  @param    {String}    name  The name of the nomenclature to get the data.
	 *  @return   {Array}           The list of data.
	 *
	 *  @throws   {Error}           If the expected nomenclature is not defined.
	 *
	 *  @access   public
	 *  @author   TAurelien
	 *  @date     2015-05-02
	 *  @version  1.0.0
	 *  @since    1.0.0
	 */
	Nomenclatures.get = function (name) {
		logger.info('Getting the nomenclature data of', name);
		var reference = this._data[name];
		if (!reference) {
			throw new Error('The nomenclature is undefined');
		}
		return this._data[name].data;
	};

	/**
	 *  Get the ids of the nomenclature data. Ids are usually used for technical reference.
	 *
	 *  @param    {String}    name  The name of the nomenclature to get the ids.
	 *  @return   {Array}           The list of ids.
	 *
	 *  @throws   {Error}           If the expected nomenclature is not defined.
	 *
	 *  @access   public
	 *  @author   TAurelien
	 *  @date     2015-05-02
	 *  @version  1.0.0
	 *  @since    1.0.0
	 */
	Nomenclatures.getIds = function (name) {
		logger.info('Getting the nomenclature data ids of', name);
		var reference = this._data[name];
		if (!reference) {
			throw new Error('The nomenclature is undefined');
		}
		return this._data[name].idArray;
	};

};