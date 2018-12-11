var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

var usersSchema = new Schema({
  username: String,
  password: String,
  email: String,
  fullname: String,
  gender: String,
  createDate: String,
  admin: Boolean,
  customer: Boolean,
  agency: Boolean,
  agencyName: String,
  agencyAdress: String,
  agencyPhoneNumber: String,
  agencyDiscription: String,
});

// Tạo mã hóa mật khẩu
usersSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// kiểm tra mật khẩu có trùng khớp
usersSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("users", usersSchema);
