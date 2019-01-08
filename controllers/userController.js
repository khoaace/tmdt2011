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
  setupAdmin: async function(req, res) {
    // create a sample user
    console.log('Comming');
    var date = new Date();
    var user = new userModel();
    user.username = "admin";
    user.fullname = "EC1805";
    user.password = user.generateHash("123123");
    user.birthDay = "1997-1-1";
    user.admin = true;
    user.createDate = date;
    user.email = "khoaace@gmail.com";
    // save the sample user
    await user.save(function(err) {
      if (err) throw err;
      console.log("User saved successfully");
      res.send('ok');
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
  },
  getListPaginate: function (req, res) {
    let start = parseInt(req.query.start) || 0;
    let length = parseInt(req.query.length) || 0;
    userModel.find({ agency: false },async function (err, users) {
        if (err) {
            return res.status(500).json({
                message: 'Error when getting users.',
                error: err
            });
        }

        await userModel.paginate({ agency: false }, { offset: start, limit: length }, function (err, result) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting users.',
                    error: err
                });
            }
            let finalResult = {
                draw: req.query.draw,
                recordsTotal: users.length,
                recordsFiltered: users.length,
                data: result.docs
            };
            res.send(finalResult);  
        });

    });
  },
  getListAgencyPaginate: function (req, res) {
    let start = parseInt(req.query.start) || 0;
    let length = parseInt(req.query.length) || 0;
    userModel.find({ agency: true },async function (err, users) {
        if (err) {
            return res.status(500).json({
                message: 'Error when getting users.',
                error: err
            });
        }
        console.log('nha xe');
        await userModel.paginate({ agency: true }, { offset: start, limit: length }, function (err, result) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting users.',
                    error: err
                });
            }
            let finalResult = {
                draw: req.query.draw,
                recordsTotal: users.length,
                recordsFiltered: users.length,
                data: result.docs
            };
            res.send(finalResult);  
        });

    });
  }
};
