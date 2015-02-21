/** @module Accounts controller */
'use strict';

var logger = require(process.env.LOGGER)('Accounts Ctrl');


/**
 * [create description]
 *
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 *
 * @return {[type]}     [description]
 */
exports.create = function(req, res) {

	logger.info('Creating a new account');

	logger.debug('Displaying req.body:');
	logger.debug(req.body);
	logger.debug('Displaying req.params:');
	logger.debug(req.params);

	var account = req.body;
	logger.debug('New account');
	logger.debug(account);

	res.json({
		status : 'success',
		message: 'Account created!'
	});

};


/**
 * [get description]
 *
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 *
 * @return {[type]}     [description]
 */
exports.get = function(req, res) {

	logger.info('Getting a specific account');

	logger.debug('Displaying req.body:');
	logger.debug(req.body);
	logger.debug('Displaying req.params:');
	logger.debug(req.params);

	var accountID = req.params.id;
	logger.debug('Account id: ' + accountID);

	res.json({
		status : 'success',
		message: 'Account with id = ' + accountID
	});

};


/**
 * [list description]
 *
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 *
 * @return {[type]}     [description]
 */
exports.list = function(req, res) {

	logger.debug('Getting a list of all accounts');

	logger.debug('Displaying req.body:');
	logger.debug(req.body);
	logger.debug('Displaying req.params:');
	logger.debug(req.params);

	res.json({
		status : 'success',
		message: 'List of accounts.'
	});

};


/**
 * [update description]
 *
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 *
 * @return {[type]}     [description]
 */
exports.update = function(req, res) {

	logger.debug('Updating a specific account');

	logger.debug('Displaying req.body:');
	logger.debug(req.body);
	logger.debug('Displaying req.params:');
	logger.debug(req.params);

	var accountID = req.params.id;
	logger.debug('Account id: ' + accountID);

	res.json({
		status : 'success',
		message: 'Account updated!'
	});

};


/**
 * [delete description]
 *
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 *
 * @return {[type]}     [description]
 */
exports.delete = function(req, res) {

	logger.debug('Deleting a specific account');

	logger.debug('Displaying req.body:');
	logger.debug(req.body);
	logger.debug('Displaying req.params:');
	logger.debug(req.params);

	var accountID = req.params.id;
	logger.debug('Account id: ' + accountID);

	res.json({
		status : 'success',
		message: 'Account deleted!'
	});

};