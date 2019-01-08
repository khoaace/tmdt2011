var tripsController = require("../controllers/tripsController");
var bookingController = require("../models/bookingModel");
var moment = require("moment");

/**
 * dashboardAgencyController.js
 *
 * @description :: Server-side logic for managing tripss.
 */
module.exports = {
    index: function (req, res) {
        res.render("dashboard-admin/index", {
            title: "Trang quản trị viên",
            user: req.session.user,
            layout: "layouts/dashboardAdminLayout"
        });
    },
    listUsers: function(req, res) {
        res.render("dashboard-admin/listUserAdmin", {
          title: "Danh sách thành viên ",
          user: req.session.user,
          layout: "layouts/dashboardAdminLayout",
          message: req.flash("info")
        });
    },
    listAgency: function(req, res) {
        res.render("dashboard-admin/listAgencyAdmin", {
          title: "Danh sách nhà xe ",
          user: req.session.user,
          layout: "layouts/dashboardAdminLayout",
          message: req.flash("info")
        });
    },
}