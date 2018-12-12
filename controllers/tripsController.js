var tripsModel = require('../models/tripsModel.js');
var agency = require('../models/usersModel.js');
var moment = require('moment');

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
        tripsModel.findOne({_id: id}, async function (err, trips) {
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
            await agency.findOne({_id:trips.agency},function(err,agency){
                if(err)
                {
                    return res.status(500).json({
                        message: 'Error when getting agency.',
                        error: err
                    }); 
                }
                if (!agency) {
                    return res.status(404).json({
                        message: 'No such agency'
                    });
                }
                trips['agencyInfo'] = agency;
                let r = Math.random().toString(36).substring(7);
                return res.render('guest/popups/booking', {
                    trip: trips,
                    layout: 'layouts/noneLayout',
                    moment: moment,
                    token: r
                  })
            })
           
        });
    },

    /**
     * tripsController.create()
     */
    create: function (req, res) {
        var trips = new tripsModel({
			agency : req.session.user,
			departure : req.body.departure,
			departureTime : req.body.departureTime,
			destination : req.body.destination,
			arrivialTime : req.body.arrivialTime,
			typeOfBus : req.body.typeOfBus,
			licensePlate : req.body.licensePlate,
            reservations : req.body.reservations,
            price : req.body.price,
            imageBus: req.body.imageBus,
        });

        trips.save(function (err, trips) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating trips',
                    error: err
                });
            }
            return res.redirect('/dashboard/new-trip');
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
			trips.arrivialTime = req.body.arrivialTime ? req.body.arrivialTime : trips.arrivialTime;
			trips.typeOfBus = req.body.typeOfBus ? req.body.typeOfBus : trips.typeOfBus;
			trips.licensePlate = req.body.licensePlate ? req.body.licensePlate : trips.licensePlate;
            trips.reservations = req.body.reservations ? req.body.reservations : trips.reservations;
            trips.price = req.body.price ? req.body.price : trips.price;
            trips.imageBus = req.body.imageBus ? req.body.imageBus : trips.imageBus;
			
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
        var id = req.body.tripId;
        tripsModel.findByIdAndRemove(id, function (err, trips) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the trips.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },



    UpdateReservation: function (req, res) {
        let id = req.params.id;
        tripsModel.findOne({_id:id}, async function (err, trips) {
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
            trips.reservations = req.body['reservations[]'] ? req.body['reservations[]'] : trips.reservations;
            await trips.save(function (err, trips) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating trips.',
                        error: err
                    });
                }
                 return res.send('ok');
            });
        });
    },


    getListPaginate: function (req, res) {
        let start = parseInt(req.query.start) || 0;
        let length = parseInt(req.query.length) || 0;
        tripsModel.find({agency: req.session.user._id},async function (err, tripss) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting trips.',
                    error: err
                });
            }
            await tripsModel.paginate({agency: req.session.user._id}, { offset: start, limit: length }, function (err, result) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting trips.',
                        error: err
                    });
                }
                let finalResult = {
                    draw: req.query.draw,
                    recordsTotal: tripss.length,
                    recordsFiltered: tripss.length,
                    data: result.docs
                };
                res.send(finalResult);  
            });

        });
    },

    generateListTrip: function (req, res) {
        var trips = new tripsModel({
			agency : req.session.user,
			departure : "Hà nội",
			departureTime : new Date(),
			destination : "Hồ Chí Minh",
			arrivialTime :  new Date(),
			typeOfBus : 16,
			licensePlate : '49A-123456',
            reservations : ['A1B5','A2B5'],
            price : 250000,
        });

        trips.save(function (err, trips) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating trips',
                    error: err
                });
            }
            return res.send("ok")
        });
    }




};


