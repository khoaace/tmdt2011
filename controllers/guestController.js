var tripsController = require("../controllers/tripsController");
var moment = require("moment");

/**
 * guestController.js
 *
 * @description :: Server-side logic for managing tripss.
 */
module.exports = {
  guest: function(req, res) {
    tripsModel.find({}, function (err, trips) {
        if (err)
          res.render("index", { title: "EC1805 ", user: req.session.user, trips: trips, moment: moment });
        else
          res.render("index", { title: "EC1805 ", user: req.session.user, trips: trips, moment: moment });
      });
  }
};