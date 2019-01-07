//model
var userModel = require('../models/usersModel');
//addon
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
  },
  updateUser: async function (req, res) {
    const { id, email, fullname, gender, agencyName, agencyAdress, agencyPhoneNumber, agencyDiscription } = req.body;

    console.log('req.body', req.body);
    await userModel.findOne({_id: id}, async (err, userResult)=>{

      if(err)
        res.status(500).json({
          message: 'Error when getting User',
          error: err
        });
      if(!userResult)
        res.status(404).json({
          message: 'No such User'
        });

      userResult.email = email ? email : userResult.email;
      userResult.fullname = fullname ? fullname : userResult.fullname;
      userResult.gender = gender ? gender : userResult.gender;
      userResult.agencyName = agencyName ? agencyName : userResult.agencyName;
      userResult.agencyAdress = agencyAdress ? agencyAdress : userResult.agencyAdress;
      userResult.agencyPhoneNumber = agencyPhoneNumber ? agencyPhoneNumber : userResult.agencyPhoneNumber;
      userResult.agencyDiscription = agencyDiscription ? agencyDiscription : userResult.agencyDiscription;

      await userResult.save().then(()=>{
        res.redirect('/profile');
      }).catch(err=>{
        res.status(500).json({
          message: 'Error when saving User',
          error: err
        });
      })

    });
    
  },
  getProfileForEdit: function (req, res) {
    res.render("user/edit-profile", { title: "Edit Profile ", user: req.session.user });
  }
};
