var express = require("express");
var router = express.Router();

/*-----------------------------------Xác thực tài khoản----------------------------*/
router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var user = req.session.user;
  // decode token
  if (user) {
      if(user.agency)
      next();
      else
      {
        req.flash('info','Bạn không có quyền truy cập vào trang này.');
        res.redirect('/error');
      }
  } else {
    req.flash('info','Chưa thực hiện đăng nhập.');
    res.redirect('/error');
  }
});

//---> /dashboard/

router.get("/", function(req, res, next) {
    res.render("index", { title: "Express test ", user: req.session.user , layout: "layouts/dashboardLayout" });
  });



module.exports = router;
