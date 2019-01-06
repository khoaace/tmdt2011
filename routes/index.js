var express = require("express");
var router = express.Router();
var tripsModel = require('../models/tripsModel.js');
var user = require('../models/usersModel');
var moment = require('moment');



// View for All memerber 


router.get("/", function (req, res, next) {
  tripsModel.find({}, function (err, trips) {
    if (err)
      res.render("index", { title: "EC1805 ", user: req.session.user, trips: trips, moment: moment });
    else
      res.render("index", { title: "EC1805 ", user: req.session.user, trips: trips, moment: moment });
  });
});

router.get("/list-trips/:page", function (req, res, next) {
  let perPage = 10;
  let page = req.params.page || 1;
  tripsModel.paginate({}, { offset: (perPage * page) - perPage, limit: perPage }, async function (err, result) {
    await tripsModel.find({}, function (err, trips) {
      if (err) return next(err);
      res.render('guest/list-trips', {
        title: "Express test ",
        trips: result.docs,
        current: page,
        pages: Math.ceil(trips.length / perPage),
        moment: moment,
        user: req.session.user
      })
    });
  });
});




router.get("/payment", isLoggedIn, function (req, res, next) {
  if (req.session.booking) {
    const { id, agency } = req.session.booking;
    let reservations = [];
     const tempReservations = req.session.booking['currentReservations[]'];
    if(typeof(tempReservations) === "string")
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
            const total = parseInt(reservations.length)*parseInt(trip.price);
            console.log(total);
            res.render("guest/payment", 
            { title: "EC1805 - Payment ", 
            user: req.session.user, 
            idBooking: idBooking, 
            trip: trip, 
            reservations: reservations, 
            dateBooking: dateBooking, 
            agency: agency, 
            total: total, 
            moment: moment });
          }
        });

    });
  }
  else
    res.redirect('/');
});

router.post("/getPayment", function (req, res, next) {
  //Save Booking information
  req.session.booking = req.body;
  res.send('ok');
});



/* GET home page. */
router.get("/error", function (req, res, next) {
  res.render("error", { title: "Error", message: req.flash("info"), user: req.session.user });
});

module.exports = router;

/*-------------------Các hàm hỗ trợ xác thực-------------------------*/
function isLoggedIn(req, res, next) {
  // Nếu một user đã xác thực, cho đi tiếp
  if (req.isAuthenticated()) return next();
  // Nếu chưa, đưa về trang chủ
  res.redirect("/signin");
}

function isUnLoggedIn(req, res, next) {
  // Nếu một user đã xác thực, cho đi tiếp
  if (req.isUnauthenticated()) return next();
  // Nếu chưa, đưa về trang chủ
  req.flash(
    "info",
    "Bạn đã đăng nhập. Vui lòng đăng xuất để sử dụng tài khoản khác"
  );
  res.redirect("/error");
}
