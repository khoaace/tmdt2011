var express = require("express");
var router = express.Router();
var tripsController = require("../controllers/tripsController.js");
var dashboardController = require('../controllers/dashboardAgencyController');

/*-----------------------------------Xác thực tài khoản----------------------------*/
router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var user = req.session.user;
  // decode token
  if (user) {
    if (user.agency) next();
    else {
      req.flash("info", "Bạn không có quyền truy cập vào trang này.");
      res.redirect("/error");
    }
  } else {
    req.flash("info", "Chưa thực hiện đăng nhập.");
    res.redirect("/error");
  }
});



router.get("/", dashboardController.dashboard);
router.get("/new-trip", dashboardController.newTrip);
router.get("/list-trips", dashboardController.listTrips);
router.get("/getTrip/:id", tripsController.show);
router.get("/generator", tripsController.generateListTrip);

router.post("/new-trip", tripsController.create);
router.get("/getListtripPaginate", tripsController.getListPaginate);
router.post("/removeTrip", tripsController.remove);


module.exports = router;
