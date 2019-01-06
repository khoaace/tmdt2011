//Controller
var tripsController = require("../controllers/tripsController");
var userController = require("../controllers/userController");
//Model
var tripsModel = require('../models/tripsModel.js');
var userModel = require('../models/usersModel');
//Extend
var moment = require("moment");

/**
 * guestController.js
 *
 * @description :: Server-side logic for managing tripss.
 */
module.exports = {
  guest: async function (req, res) {
    let promise = [];

    promise.push(userModel.find({ agency: true }));
    promise.push(tripsModel.find());

    await Promise.all(promise).then(result => {
      let listTrip = result[1] || [];
      let listAgency = result[0] || [];

      res.render("index", { title: "EC1805 ", user: req.session.user, trips: listTrip, listAgency, moment: moment });

    }).catch(err => {
      throw err;
    })
  },
  listTrips: async function (req, res) {
    let perPage = 10;
    let page = req.params.page || 1;

    tripsModel.paginate({}, { offset: (perPage * page) - perPage, limit: perPage }, async function (err, result) {
      await tripsModel.find({}, function (err, trips) {
        if (err) return next(err);

        res.render('guest/list-trips', {
          title: "List Trips",
          trips: result.docs,
          current: page,
          pages: Math.ceil(trips.length / perPage),
          moment: moment,
          user: req.session.user
        });

      });
    });
  },
  listTripsAgency: async function (req, res) {
    let perPage = 10;
    let page = req.params.page || 1;
    let id = req.params.id;  

    tripsModel.paginate({ agency: id }, { offset: (perPage * page) - perPage, limit: perPage }, async function (err, result) {
      await tripsModel.find({ agency: id }, function (err, trips) {
        if (err) return next(err);
        res.render('guest/list-trips', {
          title: "List Trips",
          trips: result.docs,
          current: page,
          pages: Math.ceil(trips.length / perPage),
          moment: moment,
          user: req.session.user
        });

      });
    });
  },
  listTripsType: async function (req, res) {
    let perPage = 10;
    let page = req.params.page || 1;
    let type = req.params.type;

    tripsModel.paginate({ typeOfBus: type }, { offset: (perPage * page) - perPage, limit: perPage }, async function (err, result) {
      await tripsModel.find({ typeOfBus: type }, function (err, trips) {
        if (err) return next(err);
        res.render('guest/list-trips', {
          title: "List Trips",
          trips: result.docs,
          current: page,
          pages: Math.ceil(trips.length / perPage),
          moment: moment,
          user: req.session.user
        });

      });
    });
  },
  listTripsSearch: async function (req, res) {
    const { departure, destination, departureTime } = req.body;
		console.log("​req.body", req.body);
    let promise = [];

/*     if(departure !== '' && destination === '' && departureTime === '')
      promise.push(tripsModel.find({departure: departure}));
    if(departure === '' && destination !== '' && departureTime === '')
      promise.push(tripsModel.find({destination: destination}));
    if(departure === '' && destination === '' && departureTime !== '')
      promise.push(tripsModel.find({departureTime: {$lt: new Date(departureTime)}}));

    if(departure !== '' && destination !== '' && departureTime === '')
      promise.push(tripsModel.find({departure: departure, destination: destination}));
    if(departure !== '' && destination === '' && departureTime !== '')
      promise.push(tripsModel.find({departure: departure, departureTime: {$lt: new Date(departureTime)}}));
    if(departure === '' && destination !== '' && departureTime !== '')
      promise.push(tripsModel.find({destination: destination, departureTime: {$lt: new Date(departureTime)}}));

    if(departure !== '' && destination !== '' && departureTime !== '')
      promise.push(tripsModel.find({departure: departure, destination: destination, departureTime: {$lt: new Date(departureTime)}}));
     */
    let time = new moment(departureTime).format();
		console.log("​time", time);
    

    await tripsModel.find({ departureTime: {$lte: time} }, (err, result)=>{
        if(err)
        throw err;
        console.log("​result", result);
        res.send(result);
    });
  },
  payment: async function (req, res) {
    if (req.session.booking) {

      const { id, agency } = req.session.booking;
      let reservations = [];
      const tempReservations = req.session.booking['currentReservations[]'];
      if (typeof (tempReservations) === "string")
        reservations.push(tempReservations);
      else
        reservations = tempReservations;
      //Generator Code ticket
      let idBooking = Math.random().toString(36).substring(7);
      let dateBooking = new Date();

      tripsModel.findOne({ _id: id }, async function (err, trip) {
        if (err)
          res.redirect('/');
        if (!trip)
          res.redirect('/');
        else

          await user.findOne({ _id: agency }, function (err, agency) {
            if (err)
              res.redirect('/');
            if (!agency)
              res.redirect('/');
            else {
              const total = parseInt(reservations.length) * parseInt(trip.price);
              console.log(total);
              res.render("guest/payment",
                {
                  title: "EC1805 - Payment ",
                  user: req.session.user,
                  idBooking: idBooking,
                  trip: trip,
                  reservations: reservations,
                  dateBooking: dateBooking,
                  agency: agency,
                  total: total,
                  moment: moment
                });
            }
          });

      });

    }
    else
      res.redirect('/');
  },
  getPayment: async function (req, res) {
    //Save Booking information
    req.session.booking = req.body;
    res.send('ok');
  },
  getError: async function (req, res) {
    res.render("error", { title: "Error", message: req.flash("info"), user: req.session.user });
  }

};


