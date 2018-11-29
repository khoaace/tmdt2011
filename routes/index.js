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

router.get("/list-trips/:page", function (req, res, next) {
  let perPage = 3;
  let page = req.params.page || 1;
  tripsModel.paginate({}, { offset:(perPage * page) - perPage, limit: perPage }, async function (err, result) {
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
