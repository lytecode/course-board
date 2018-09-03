const bodyParser = require("body-parser"),
  ejs = require("ejs"),
  express = require("express"),
  flash = require("connect-flash"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  urlencodedParser = bodyParser.urlencoded({ extended: false }),
  router = require("./app/route/route"),
  User = require("./app/models/user");

const app = express(),
  port = process.env.PORT || 5000;

//setup the database
mongoose.connect(process.env.Mongo_URI || "mongodb://localhost/trackit");
const db = mongoose.connection;
db.on("connected", () => console.log("db connected successfully"));
db.on("error", () => console.log("Ooops! Something went wrong!"));

app.use(urlencodedParser);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//passport config
app.use(
  require("express-session")({
    secret: "Get this baby cooking",
    resave: false,
    saveUninitialized: false
  })
);

//setup connect-flash
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(router);

app.listen(port, () => console.log(`app started on port ${port}`));
