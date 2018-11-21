var tripsModel = require('../models/tripsModel.js');

/**
 * tripsController.js
 *
 * @description :: Server-side logic for managing tripss.
 */
module.exports = {

    /**
     * tripsController.list()
     */
    list: function (req, res) {
        tripsModel.find(function (err, tripss) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting trips.',
                    error: err
                });
            }
            return res.json(tripss);
        });
    },

    /**
     * tripsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        tripsModel.findOne({_id: id}, function (err, trips) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting trips.',
                    error: err
                });
            }
            if (!trips) {
                return res.status(404).json({
                    message: 'No such trips'
                });
            }
            return res.json(trips);
        });
    },

    /**
     * tripsController.create()
     */
    create: function (req, res) {
        var trips = new tripsModel({
			agency : req.body.agency,
			departure : req.body.departure,
			departureTime : req.body.departureTime,
			destination : req.body.destination,
			arrivalTime : req.body.arrivalTime,
			price : req.body.price

        });

        trips.save(function (err, trips) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating trips',
                    error: err
                });
            }
            return res.status(201).json(trips);
        });
    },

    /**
     * tripsController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        tripsModel.findOne({_id: id}, function (err, trips) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting trips',
                    error: err
                });
            }
            if (!trips) {
                return res.status(404).json({
                    message: 'No such trips'
                });
            }

            trips.agency = req.body.agency ? req.body.agency : trips.agency;
			trips.departure = req.body.departure ? req.body.departure : trips.departure;
			trips.departureTime = req.body.departureTime ? req.body.departureTime : trips.departureTime;
			trips.destination = req.body.destination ? req.body.destination : trips.destination;
			trips.arrivalTime = req.body.arrivalTime ? req.body.arrivalTime : trips.arrivalTime;
			trips.price = req.body.price ? req.body.price : trips.price;
			
            trips.save(function (err, trips) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating trips.',
                        error: err
                    });
                }

                return res.json(trips);
            });
        });
    },

    /**
     * tripsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        tripsModel.findByIdAndRemove(id, function (err, trips) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the trips.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
