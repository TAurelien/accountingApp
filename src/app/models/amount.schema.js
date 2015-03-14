/** @module Amount Schema */
'use strict';

// Module dependencies ========================================================
var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

// Amount schema definition ===================================================
var AmountSchema = new Schema ({

	quantity:{
		type     : Number,
		required : true
	},

	unitary:{
		type     : Number,
		required : true
	},

	value:{
		type     : Number,
		required : true
	},

	scaleFactor: {
		type     : Number,
		default  : 100,
		required : true
	}

});


// Pre processing =============================================================

AmountSchema.pre('save', function(next) {

	if (!this.quantity) {
		this.quantity = 1;
	}

	if (!this.unitary) {
		this.unitary = this.value;
	}

	if (!this.value && this.unitary) {
		this.value = this.quantity * this.unitary;
	}

	next();

});


// Model export ===============================================================

module.exports = AmountSchema;