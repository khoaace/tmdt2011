var express = require("express");
var router = express.Router();
var tripsController = require("../controllers/tripsController.js");
var dashboardController = require('../controllers/dashboardAgencyController');
var bookingController = require('../controllers/bookingController');
var dashboardAdminController = require('../controllers/dashboardAdminController');
var userControlller = require('../controllers/userController');

/*-----------------------------------Xác thực tài khoản----------------------------*/
router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var user = req.session.user;
  // decode token
  if (user) {
    if (user.admin) next();
    else {
      req.flash("info", "Bạn không có quyền truy cập vào trang này.");
      res.redirect("/error");
    }
  } else {
    req.flash("info", "Chưa thực hiện đăng nhập.");
    res.redirect("/error");
  }
});


router.get("/", dashboardAdminController.index);
router.get("/list-users", dashboardAdminController.listUsers);
router.get("/getListUserPaginate", userControlller.getListPaginate);

router.get("/list-agency", dashboardAdminController.listAgency);
router.get("/getListAgencyPaginate", userControlller.getListAgencyPaginate);

/* router.get("/new-trip", dashboardController.newTrip);
router.get("/list-trips", dashboardController.listTrips);
router.get("/list-bookings", dashboardController.listBookings);

router.get("/getTrip/:id", tripsController.show);
router.get("/generator", tripsController.generateListTrip);

router.post("/new-trip", tripsController.create);
router.get("/getListtripPaginate", tripsController.getListPaginate);
router.get("/getListBookingPaginate", bookingController.getListPaginate);
router.post("/removeTrip", tripsController.remove); */


module.exports = router;
