var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
var mongoose = require("mongoose");
var passport = require('passport');

var indexRouter = require("./routes/index");

var configDB = require("./config/database");
var session = require("express-session");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var flash = require("connect-flash");

var app = express();

// view engine setup
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//Set layout default


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: "keyboard cat", cookie: { maxAge: 43200000 } }));
app.use(flash());
// Login
app.use(passport.initialize());
app.use(passport.session());

require("./routes/usersRoutes")(app, passport);
require("./config/passport")(passport);

app.use("/", indexRouter);

//connect to database
mongoose.connect(
  configDB.database,
  { useNewUrlParser: true },
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("[i] - ket noi den Database thanh cong!");
    }
  }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
