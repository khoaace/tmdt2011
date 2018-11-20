var usersModel = require("../models/usersModel.js");

/**
 * usersController.js
 *
 * @description :: Server-side logic for managing userss.
 */
module.exports = {
  /**
   * usersController.list()
   */
  list: function(req, res) {
    usersModel.find(function(err, userss) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting users.",
          error: err
        });
      }
      return res.json(userss);
    });
  },

  /**
   * usersController.show()
   */
  show: function(req, res) {
    var id = req.params.id;
    usersModel.findOne({ _id: id }, function(err, users) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting users.",
          error: err
        });
      }
      if (!users) {
        return res.status(404).json({
          message: "No such users"
        });
      }
      return res.json(users);
    });
  },

  /**
   * usersController.create()
   */
  create: function(req, res) {
    var users = new usersModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullname: req.body.fullname,
      gender: req.body.gender,
      createDate: req.body.createDate,
      admin: req.body.admin,
      customer: req.body.customer,
      agency: req.body.agency
    });

    users.save(function(err, users) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating users",
          error: err
        });
      }
      return res.status(201).json(users);
    });
  },

  /**
   * usersController.update()
   */
  update: function(req, res) {
    var id = req.params.id;
    usersModel.findOne({ _id: id }, function(err, users) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting users",
          error: err
        });
      }
      if (!users) {
        return res.status(404).json({
          message: "No such users"
        });
      }

      users.username = req.body.username ? req.body.username : users.username;
      users.password = req.body.password ? req.body.password : users.password;
      users.email = req.body.email ? req.body.email : users.email;
      users.fullname = req.body.fullname ? req.body.fullname : users.fullname;
      users.gender = req.body.gender ? req.body.gender : users.gender;
      users.createDate = req.body.createDate
        ? req.body.createDate
        : users.createDate;
      users.admin = req.body.admin ? req.body.admin : users.admin;
      users.customer = req.body.customer ? req.body.customer : users.customer;
      users.agency = req.body.agency ? req.body.agency : users.agency;

      users.save(function(err, users) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating users.",
            error: err
          });
        }

        return res.json(users);
      });
    });
  },

  /**
   * usersController.remove()
   */
  remove: function(req, res) {
    var id = req.params.id;
    usersModel.findByIdAndRemove(id, function(err, users) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the users.",
          error: err
        });
      }
      return res.status(204).json();
    });
  }
};
