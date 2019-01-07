var passport = require("passport");
var User = require("../models/usersModel");
var LocalStrategy = require("passport-local").Strategy;
var jwt = require("jsonwebtoken");

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        // mặc định local strategy sử dụng username và password,
        // chúng ta cần cấu hình lại
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true // cho phép chúng ta gửi reqest lại hàm callback
      },
      function(req, username, password, done) {
        let error = false;
        process.nextTick(function() {
          User.findOne({ username: username }, function(err, user) {
            if (err) return done(err);
            var cur_date = new Date();
            cur_date = cur_date.toLocaleString("en-US", {
              timeZone: "Asia/Jakarta"
            });
            if (user) {
              return done(
                null,
                false,
                req.flash("info", "Tên đăng nhập đã được sử dụng")
              );
            }
            else if(req.body.password !== req.body.repassword)
            {
              return done(
                null,
                false,
                req.flash("info", "Mật khẩu nhập lại không chính xác")
              );
            }
            else if (req.body.typeOfAccount === "agency"){
              let newUser = new User();
              newUser.username = username;
              newUser.admin = false;
              newUser.customer = false;
              newUser.agency = true;
              newUser.email = req.body.email;
              newUser.gender = req.body.gender;
              newUser.password = newUser.generateHash(password);
              newUser.createDate = cur_date;
              newUser.fullname = req.body.fullname;
              newUser.agencyName = req.body.agencyName;
              newUser.agencyAdress = req.body.agencyAdress;
              newUser.agencyPhoneNumber = req.body.agencyPhoneNumber;
              newUser.agencyDiscription = req.body.agencyDiscription;
              // lưu user
              newUser.save(function(err) {
                if (err) throw err;
                req.session.user = newUser;
                return done(null, newUser);
              });
            } 
            else {
              let newUser = new User();
              newUser.username = username;
              newUser.admin = false;
              newUser.customer = true;
              newUser.agency = false;
              newUser.gender = req.body.gender;
              newUser.email = req.body.email;
              newUser.password = newUser.generateHash(password);
              newUser.createDate = cur_date;
              newUser.fullname = req.body.fullname;
              // lưu user
              newUser.save(function(err) {
                if (err) throw err;
                req.session.user = newUser;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, username, password, done) {
        User.findOne({ username: username }, function(err, user) {
          if (err) return done(err);
          // if no user is found, return the message
          if (!user)
            return done(
              null,
              false,
              req.flash("info", "Không tìm thấy tên đăng nhập này")
            );
          // if the user is found but the password is wrong
          if (!user.validPassword(password))
            return done(null, false, req.flash("info", "Sai mật khẩu")); // thông báo lỗi chỉ này chỉ dùng khi dev
          req.session.user = user;
          return done(null, user);
        });
      }
    )
  );

  function getCurrentTime() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    var mytoday = dd + "/" + mm + "/" + yyyy;
    return mytoday;
  }
};
