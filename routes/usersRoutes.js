var User = require("../models/usersModel");
module.exports = function(app, passport) {

  /*------------------------------Đăng nhập-------------------------------------*/
  app.post(
    "/signin",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // chuyển hướng tới trang được bảo vệ
      failureRedirect: "/signin", // trở lại trang đăng ký nếu có lỗi
      failureFlash: true // allow flash messages
    })
  );

  app.get("/signin", isUnLoggedIn, function(req, res) {
    if (req.user != null) res.redirect("/");
    res.render("user/signin", {
      title: "Đăng nhập",
      message: req.flash("info")
    });
  });
   
    /*----------------------Đăng kí--------------------------*/
    app.get("/signup", function(req, res) {
      res.render("user/signup", {
        title: "EC1805 - Đăng kí",
        message: req.flash("info")
      });
    });
    
    app.post(
      "/signup",
      passport.authenticate("local-signup", {
        successRedirect: "/profile", // chuyển hướng tới trang được bảo vệ
        failureRedirect: "/signup", // trở lại trang đăng ký nếu có lỗi
        failureFlash: true // allow flash messages
      })
    );
  /* --------------------------------- Đăng xuất ----------------------------*/
  app.get("/logout", function(req, res) {
    // create a sample user
    req.session.destroy();
    req.logout();
    res.redirect("/");
  });

  app.get("/profile", isLoggedIn,function(req, res, next) {
    res.render("user/profile", { title: "Profile ", user: req.session.user });
  });

  // Tạo tài khoản Admin
  app.get('/setup', function (req, res) {
    // create a sample user
    var date = new Date();
    var user = new User();
    user.username = 'admin';
    user.password = user.generateHash('123123');
    user.birthDay="1997-1-1";
    user.createDate = date;
    user.email = "khoaace@gmail.com";
    // save the sample user
    user.save(function (err) {
        if (err) throw err;
        console.log('User saved successfully');
    });
});
};

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
