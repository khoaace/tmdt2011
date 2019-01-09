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
    const perPage = 10;
    const page = req.params.page || 1;
    let favorite = [];
    if(req.session.user)
    {
      favorite = req.session.user.favorite;
    }

    tripsModel.paginate({}, { offset: (perPage * page) - perPage, limit: perPage }, async function (err, result) {
      let promise = [];
      result.docs.forEach(element =>{
        promise.push(userModel.findOne({_id: element.agency}));
      });
      await Promise.all(promise).then(async agencyResult =>{
        await tripsModel.find({}, function (err, trips) {
          if (err) return next(err);
  
          res.render('guest/list-trips', {
            title: "List Trips",
            trips: result.docs,
            current: page,
            pages: Math.ceil(trips.length / perPage),
            moment: moment,
            favorite: favorite,
            agency: agencyResult,
            user: req.session.user
          });

        });
      }).catch(err=>{
        throw err;
      })
     
    });
  },
  listTripsAgency: async function (req, res) {
    let perPage = 10;
    let page = req.params.page || 1;
    let id = req.params.id;
    let favorite = [];

    if(req.session.user)
    {
      favorite = req.session.user.favorite;
    }

    tripsModel.paginate({ agency: id }, { offset: (perPage * page) - perPage, limit: perPage }, async function (err, result) {
      let promise = [];
      result.docs.forEach(element =>{
        promise.push(userModel.findOne({_id: element.agency}));
      });
      await Promise.all(promise).then(async agencyResult =>{
        await tripsModel.find({}, function (err, trips) {
          if (err) return next(err);
  
          res.render('guest/list-trips', {
            title: "List Trips",
            trips: result.docs,
            current: page,
            pages: Math.ceil(trips.length / perPage),
            moment: moment,
            favorite: favorite,
            agency: agencyResult,
            user: req.session.user
          });

        });
      }).catch(err=>{
        throw err;
      })
    });
  },
  listTripsType: async function (req, res) {
    let perPage = 10;
    let page = req.params.page || 1;
    let type = req.params.type;
    let favorite = [];

    if(req.session.user)
    {
      favorite = req.session.user.favorite;
    }

    tripsModel.paginate({ typeOfBus: type }, { offset: (perPage * page) - perPage, limit: perPage },  async function (err, result) {
      let promise = [];
      result.docs.forEach(element =>{
        promise.push(userModel.findOne({_id: element.agency}));
      });
      await Promise.all(promise).then(async agencyResult =>{
        await tripsModel.find({}, function (err, trips) {
          if (err) return next(err);
  
          res.render('guest/list-trips', {
            title: "List Trips",
            trips: result.docs,
            current: page,
            pages: Math.ceil(trips.length / perPage),
            moment: moment,
            favorite: favorite,
            agency: agencyResult,
            user: req.session.user
          });

        });
      }).catch(err=>{
        throw err;
      })
    });
  },
  
  listTripsSearch: async function (req, res) {
    const { departure, destination, departureTime } = req.body;
    let search = {
      departure,
      destination,
      departureTime
    }
    console.log('req.body', req.body);
    let favorite = [];
    if(req.session.user)
    {
      favorite = req.session.user.favorite;
    }

    let input = {};


    if (departure !== '')
      input.departure = departure;
    if (destination !== '')
      input.destination = destination;
    if (departureTime !== '')
    {
      let time = new moment(departureTime).format();
      input.departureTime = { "$gte": new Date(time) };
    }
      

    await tripsModel.find(input).exec((err, result) => {
      if (err)
        throw err;

        let promiseAgency = [];
        result.forEach(element =>{
          promiseAgency.push(userModel.findOne({_id: element.agency}));
        });
        Promise.all(promiseAgency).then(agencyResult=>{
          res.render("guest/list-trips-search",
          {
            title: "EC1805 - Payment ",
            trips: result,
            moment: moment,
            favorite: favorite,
            agency: agencyResult,
            layout: 'layouts/noneLayout',
            user: req.session.user,
            search: search
          });
        }).catch(err=> {
          throw err
        });

    });
  },
  listTripsFavorite: async function (req, res) {
    let favorite = req.session.user.favorite;
    let promise = [];
    if(favorite)
    {
      favorite.forEach(element => {
        promise.push(tripsModel.findOne({_id: element}));
      });

      await Promise.all(promise).then(result =>{
        let promiseAgency = [];
        result.forEach(element =>{
          promiseAgency.push(userModel.findOne({_id: element.agency}));
        });
        Promise.all(promiseAgency).then(agencyResult=>{
          res.render("guest/list-trips-favorite",
          { 
            title: "EC1805 - List Trips",
            trips: result,
            moment: moment,
            favorite: favorite,
            agency: agencyResult,
            user: req.session.user,
          });
        }).catch(err=>{
          throw err;
        })
    
      }).catch(err=>{
        throw err;
      });
    }else throw "Fovarite is empty";
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

          await userModel.findOne({ _id: agency }, function (err, agency) {
            if (err)
              res.redirect('/');
            if (!agency)
              res.redirect('/');
            else {
              const total = parseInt(reservations.length) * parseInt(trip.price);
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


