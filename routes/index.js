var express = require("express");
var router = express.Router();
var tripsModel = require('../models/tripsModel.js');
var moment = require('moment');

/* GET home page. */
router.get("/error", function(req, res, next) {
  res.render("error", { title: "Error", message: req.flash("info"), user: req.session.user });
});


router.get("/", function(req, res, next) {
  tripsModel.find({},function(err,trips){
    if(err)
    res.render("index", { title: "Express test ", user: req.session.user, trips: trips, moment: moment });
    else
    res.render("index", { title: "Express test ", user: req.session.user, trips: trips, moment: moment});
  });

});

/*-----------------------------------Xác thực tài khoản----------------------------*/
router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var user = req.session.user;
  //req.body.token || req.query.token || req.headers['x-access-token']
  // decode token
  if (user) {
      next();
  } else {
      req.flash('info','Chưa thực hiện đăng nhập.');
      res.redirect('/error');
  }
});



module.exports = router;
