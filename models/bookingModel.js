var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema   = mongoose.Schema;

var bookingSchema = new Schema({
	'code' : String,
	'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'users'
	},
	'trip' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'trips'
	},
	'agency' : {
		type: Schema.Types.ObjectId,
		ref: 'users'
   },
	'totalMoney' : Number,
	'createDay' : Date,
	'seatCode' : Array
});

bookingSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('booking', bookingSchema);
