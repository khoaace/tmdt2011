var User = require("../models/usersModel");
var userController = require("../controllers/userController");
var bookingController = require("../controllers/bookingController.js");

module.exports = function(app, passport) {
  app.get("/signin", isUnLoggedIn, userController.signin);
  app.get("/signup", userController.signup);
  app.get("/logout", userController.logout);
  app.get("/profile", isLoggedIn, userController.profile);
  app.get("/edit-profile", isLoggedIn, userController.getProfileForEdit);
  app.post("/update-profile", isLoggedIn, userController.updateUser);
  app.post("/update-favorite", isLoggedIn, userController.updateFavorite);
  app.get("/sync-user",isLoggedIn, userController.syncUser);
  app.get("/history-purchase", isLoggedIn, bookingController.showByUser);
  app.get("/setup", userController.setupAdmin);
  app.get("/update-all", userController.updateAllUser);
  app.post("/delete-user", userController.deleteUser);
  app.post('/change-password', isLoggedIn, userController.changePassword);
  app.get('/change-password', isLoggedIn, userController.getChangePassword);

  app.post(
    "/signin",
    passport.authenticate("local-login", {
      successRedirect: "/profile",
      failureRedirect: "/signin",
      failureFlash: true
    })
  );
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile",
      failureRedirect: "/signup",
      failureFlash: true
    })
  );
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
