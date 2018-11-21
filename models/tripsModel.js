var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var tripsSchema = new Schema({
	'agency' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'usersModel'
	},
	'departure' : String,
	'departureTime' : Date,
	'destination' : String,
	'arrivalTime' : Date,
	'price' : Number
});

module.exports = mongoose.model('trips', tripsSchema);
