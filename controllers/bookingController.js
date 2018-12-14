var bookingModel = require('../models/bookingModel.js');
var agency = require('../models/usersModel.js');
var trip = require('../models/tripsModel');
var moment = require('moment');
/**
 * bookingController.js
 *
 * @description :: Server-side logic for managing bookings.
 */
module.exports = {

    /**
     * bookingController.list()
     */
    list: function (req, res) {
        bookingModel.find(function (err, bookings) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting booking.',
                    error: err
                });
            }
            return res.json(bookings);
        });
    },

    /**
     * bookingController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        bookingModel.findOne({ _id: id }).populate('trip').populate('agency').exec(async function (err, booking) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting booking.',
                    error: err
                });
            }
            if (!booking) {
                return res.status(404).json({
                    message: 'No such booking'
                });
            }
            res.send(booking);
        });
    },

    /**
     * bookingController.create()
     */
    create: function (req, res) {
        let tempReservations = req.session.booking['currentReservations[]'];
        let reservations = [];
        if (typeof (tempReservations) === "string")
            reservations.push(tempReservations);
        else
            reservations = tempReservations;
        var booking = new bookingModel({
            code: req.body.code,
            user: req.body.user,
            agency: req.body.agency,
            trip: req.body.trip,
            totalMoney: req.body.totalMoney,
            createDay: new Date(),
            seatCode: reservations
        });
        console.log(booking);
        booking.save(function (err, booking) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating booking',
                    error: err
                });
            }
            return res.send('oke');
        });
    },

    /**
     * bookingController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        bookingModel.findOne({ _id: id }, function (err, booking) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting booking',
                    error: err
                });
            }
            if (!booking) {
                return res.status(404).json({
                    message: 'No such booking'
                });
            }

            booking.code = req.body.code ? req.body.code : booking.code;
            booking.user = req.body.user ? req.body.user : booking.user;
            booking.trip = req.body.trip ? req.body.trip : booking.trip;
            booking.totalMoney = req.body.totalMoney ? req.body.totalMoney : booking.totalMoney;
            booking.createDay = req.body.createDay ? req.body.createDay : booking.createDay;
            booking.seatCode = req.body.seatCode ? req.body.seatCode : booking.seatCode;

            booking.save(function (err, booking) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating booking.',
                        error: err
                    });
                }

                return res.json(booking);
            });
        });
    },

    /**
     * bookingController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        bookingModel.findByIdAndRemove(id, function (err, booking) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the booking.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },
    showByUser: function (req, res) {
        bookingModel.find({ user: req.session.user._id }).populate('trip').populate('agency').exec(async function (err, booking) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting booking.',
                    error: err
                });
            }
            if (!booking) {
                return res.status(404).json({
                    message: 'No such booking'
                });
            }
            res.render("user/historyPurchase", { title: "History Purchase ", user: req.session.user, bookings: booking, moment: moment });
        });
    }
};
