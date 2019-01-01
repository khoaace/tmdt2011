var moment = require("moment");

/**
 * userController.js
 *
 * @description :: Server-side logic for managing tripss.
 */
module.exports = {
  signin: function(req, res) {
    if (req.user != null) res.redirect("/");
    res.render("user/signin", {
      title: "Đăng nhập",
      message: req.flash("info")
    });
  },
  signup: function(req, res) {
    res.render("user/signup", {
      title: "EC1805 - Đăng kí",
      message: req.flash("info")
    });
  },
  logout: function(req, res) {
    req.session.destroy();
    req.logout();
    res.redirect("/");
  },
  profile: function(req, res) {
    res.render("user/profile", { title: "Profile ", user: req.session.user });
  },
  setupAdmin: function(req, res) {
    // create a sample user
    var date = new Date();
    var user = new User();
    user.username = "admin";
    user.password = user.generateHash("123123");
    user.birthDay = "1997-1-1";
    user.createDate = date;
    user.email = "khoaace@gmail.com";
    // save the sample user
    user.save(function(err) {
      if (err) throw err;
      console.log("User saved successfully");
    });
  }
};
