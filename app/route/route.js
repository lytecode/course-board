const Course = require("../models/course");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

function loginRequired(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash("error", "You need to login!");
  res.redirect("/");
}

router.use(function(req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

//Render the Home page (Login page)
router.get("/", (req, res) => res.render("home"));

//Login a Registered Student
router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/courses",
    // successFlash: "Welcome ",
    failureRedirect: "/"
    // failureFlash: true
  })
);

//Sign Up a Student
router.get("/register", (req, res) => res.render("register"));
router.post("/register", (req, res) => {
  const Student = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username
  });

  User.register(Student, req.body.password, (err, student) => {
    if (err) {
      console.log(err);
      return res.flash("error", err);
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});

//List of available courses
router.get("/courses", loginRequired, (req, res) => {
  Course.find({}, (err, courses) => {
    if (err) console.log(err);

    res.render("courses", { courses: courses });
  });
});

//Register a course
router.post("/courses", loginRequired, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, student) => {
    if (err) return console.log(err);

    if (student.courses.includes(req.body.course)) {
      req.flash("error", `${req.body.course} already registered!`);
      return res.redirect("/courses");
    } else {
      student.courses.push(req.body.course);
      student.save();

      req.flash("success", `${req.body.course} added Successfully!`);
      res.redirect("/courses");
    }
  });
});

//Student's profile page
router.get("/profile", loginRequired, (req, res) => {
  User.findById(req.user._id, (err, student) => {
    if (err) {
      req.flash("error", "No user found");
      return res.redirect("back");
    }

    res.render("profile", { student: student });
  });
});

//Delete a registered course
router.delete("/course/:id/:cid", loginRequired, (req, res) => {
  User.findById(req.params.id, (err, student) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }

    student.courses.splice(req.params.cid, 1);
    student.save();
    req.flash("success", "Course deleted successfully!");
    res.redirect("/profile");
  });
});

//Logout
router.get("/logout", loginRequired, (req, res) => {
  req.session.destroy(err => {
    res.clearCookie("connect.sid"), res.redirect("/");
  });
});

//failure page 404
router.get("*", (req, res, next) => res.render("404"));

module.exports = router;
