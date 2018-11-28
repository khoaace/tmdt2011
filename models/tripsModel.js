var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var tripsSchema = new Schema({
	'agency': {
		type: Schema.Types.ObjectId,
		ref: 'usersModel'
	},
	'departure': String,
	'departureTime': Date,
	'destination': String,
	'arrivialTime': Date,
	'typeOfBus': Number,
	'licensePlate': String,
	'reservations': Array,
	'price': Number,
});

tripsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('trips', tripsSchema);
