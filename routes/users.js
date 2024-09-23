const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utlis/catchAsync");
const passport = require("passport");
const LocalStrategy = require("passport-local");

router.get("/register", (req, res) => {
  res.render("users/register");
});

// if you recall, the way that we do this is by first making an empty, well, it's not empty, but a basic user model instance where we pass in
// the username and the email but not the password. And then we call user.register.
// if something goes wrong flash error message instead a template what we were doing before, use try catch block
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      await User.register(user, password);
      req.flash("success", "Welcome to yelpCamp!");
      res.redirect("/campgrounds");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  })
);

// Passport gives us a middleware we can use called passport dot authenticate and passport dot authenticate, we can just throw right in there
// just like any other middleware. And it's going to expect us to specify the strategy local but we gonna have multiple, so we could set up a route to authenticate local and then
// a different route to authenticate Google or Twitter. So after that, we have some options, we can specify in an object and I'm gonna do
// failure flash is one of them, which is true. It's just gonna flash a message for us automatically. And then we'll also set failure
// redirect if things go wrong. Redirect, I want you to redirect to slash login again.

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "welcome back!");
    res.redirect("/campgrounds");
  }
);

module.exports = router;
