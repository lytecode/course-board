const Course = require("../models/course");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//Render the Home page (Login page)
router.get("/", (req, res) => res.render("home"));

//Login a Registered Student
router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/profile",
    successFlash: "Welcome ",
    failureRedirect: "/",
    failureFlash: true
  })
);

//Sign Up a Student
router.get("/register", (req, res) => res.render("register"));

module.exports = router;
