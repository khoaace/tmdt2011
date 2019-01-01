var moment = require("moment");

/**
 * dashboardAgencyController.js
 *
 * @description :: Server-side logic for managing tripss.
 */
module.exports = {
  dashboard: function (req, res) {
    res.render("dashboard-agency/index", {
        title: "Quản lý nhà xe",
        user: req.session.user,
        layout: "layouts/dashboardLayout"
      });
  },
  newTrip: function (req, res) {
    res.render("dashboard-agency/newScheduleAgency", {
        title: "Thêm lịch trình mới ",
        user: req.session.user,
        layout: "layouts/dashboardLayout",
        message: req.flash("info")
      });
  },
  listTrips: function(req, res) {
    res.render("dashboard-agency/listScheduleAgency", {
        title: "Danh sách lịch trình ",
        user: req.session.user,
        layout: "layouts/dashboardLayout",
        message: req.flash("info")
      });
  },

}