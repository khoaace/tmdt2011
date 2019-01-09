var express = require("express");
var router = express.Router();
var tripsModel = require('../models/tripsModel.js');
var guestController = require('../controllers/guestController');
var user = require('../models/usersModel');
var moment = require('moment');



// View for All memerber 

router.get("/", guestController.guest);

router.get("/list-trips/:page", guestController.listTrips);

router.get("/list-trips-agency/:id/:page", guestController.listTripsAgency);

router.get("/list-trips-type/:type/:page", guestController.listTripsType);

router.post("/list-trips-search", guestController.listTripsSearch);

router.get("/list-trips-favorite", isLoggedIn, guestController.listTripsFavorite);

router.get("/payment", isLoggedIn, guestController.payment);

router.post("/getPayment",isLoggedIn, guestController.getPayment);

router.get("/error", guestController.getError);

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
