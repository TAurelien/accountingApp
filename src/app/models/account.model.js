/** @module Account model */
'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var constants = require(process.env.CONSTANTS);

var AccountSchema = new Schema({

	name: {
		type: String,
		trim: true,
		default: '',
		required : true
	},

	description: {
		type: String,
		trim: true,
		default: ''
	},

	type: {
		type: String,
		trim: true,
		default: '',
		required : true,
		enum : constants.accountTypeAsArray
	},

	code: {
		type: String,
		trim: true,
		default: ''
	},

	commodity: {
		type: String,
		trim: true,
		default: '',
		required : true,
		enum : constants.commoditiesAsArray
	},

	balance: {
		type: Number,
		default: 0
	},

	placeholder: {
		type: Boolean,
		default: false
	},

	closed: {
		type: Boolean,
		default: false
	},

	parent: {
		type: Schema.ObjectId,
		ref: 'Account'
	},

	// add a setter to determine the level from the parent's one (automatic?)
	level: {
		type: Number,
		default: 0,
		min : 0
	}

});

module.exports = mongoose.model('Account', AccountSchema);