/** @module Account model */
'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


var AccountSchema = new Schema({

	name: {
		type: String,
		trim: true,
		default: ''
	},

	description: {
		type: String,
		trim: true,
		default: ''
	},

	type: {
		type: String,
		trim: true,
		default: ''
	},

	code: {
		type: String,
		trim: true,
		default: ''
	},

	commodity: {
		type: String,
		trim: true,
		default: ''
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
	}

});

module.exports = mongoose.model('Account', AccountSchema);