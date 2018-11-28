var express = require("express");
var router = express.Router();
var tripsController = require('../controllers/tripsController.js');

/*-----------------------------------Xác thực tài khoản----------------------------*/
router.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var user = req.session.user;
  // decode token
  if (user) {
    if (user.agency)
      next();
    else {
      req.flash('info', 'Bạn không có quyền truy cập vào trang này.');
      res.redirect('/error');
    }
  } else {
    req.flash('info', 'Chưa thực hiện đăng nhập.');
    res.redirect('/error');
  }
});

//---> /dashboard/

router.get("/", function (req, res, next) {
  res.render("dashboard-agency/index", { title: "Quản lý nhà xe", user: req.session.user, layout: "layouts/dashboardLayout" });
});
router.get("/new-trip", function (req, res, next) {
  res.render("dashboard-agency/newScheduleAgency", { title: "Thêm lịch trình mới ", user: req.session.user, layout: "layouts/dashboardLayout", message: req.flash("info") });
});

router.get("/list-trips", function (req, res, next) {
  res.render("dashboard-agency/listScheduleAgency", { title: "Danh sách lịch trình ", user: req.session.user, layout: "layouts/dashboardLayout", message: req.flash("info") });
});

router.post("/new-trip", tripsController.create);

router.get("/get-trip/:id", tripsController.show);

router.get("/get-list-trip-paginate", tripsController.getListPaginate);

router.post("/remove-trip", tripsController.remove);




module.exports = router;