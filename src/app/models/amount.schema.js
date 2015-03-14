/** @module Amount Schema */
'use strict';

// Module dependencies ========================================================
var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

// Amount schema definition ===================================================
var AmountSchema = new Schema ({

	quantity:{
		type     : Number,
		default  : 1,
		required : true
	},

	unitary:{
		type     : Number
	},

	value:{
		type     : Number,
		required : true
	},

	scaleFactor: {
		type     : Number,
		required : true
	}

});


// Pre processing =============================================================

AmountSchema.pre('save', function(next) {

	if (this.quantity === 0) {

		this.unitary = 0;
		this.value = 0;

	} else {

		if (!this.unitary) {
			this.unitary = this.value / this.quantity;
		}

	}

	next();

});


// Model export ===============================================================

module.exports = AmountSchema;