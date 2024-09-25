const ExpressError = require("./utlis/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const Campground = require("./models/campground");
const Review = require("./models/review.js");

// module.exports.isLoggedIn = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     req.flash("error", "you must be signed in!");
//     return res.redirect("/login");
//   }
//   // if everything went ok then move next
//   next();
// };

////******************************** currentUser helper
// We wanna show these user links depending upon whether they logged in or not, how we know if someone is logged in. Currently, Passport is just taken care of,
// basically giving us this nice method, isAuthenticated, but how can I easily get access to the actual user itself, the object or the ID or something around the user? Well, it's really easy.
// There is something on the request called user, to automatically put there for us, request.user. So that will contain information about the user.
// it is going to be automatically filled in with the deserialized information from the session. So the session stores the serialized user,
// Passport is going to deserialize, unserialize it and fill in request.user with that data.
// req.user will undefined if you are not logged in

// module.exports.isLoggedIn = (req, res, next) => {
//   //   console.log("Req.user..", req.user);
//   if (!req.isAuthenticated()) {
//     req.flash("error", "you must be signed in!");
//     return res.redirect("/login");
//   }
//   // if everything went ok then move next
//   next();
// };

////************************** returnTo behaviour && add other middlwares
// add the code that creates a new middleware function called storeReturnTo which is used to save the returnTo value from the session (req.session.returnTo) to res.locals:

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log(req.path, req.originalUrl);  // if try to /new w/o login =>   /new  /campgrounds/new
    // store the url
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you must be signed in!");
    return res.redirect("/login");
  }
  // if everything went ok then move next
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash(
      "error",
      "you do not have the permission to update the campground!"
    );
    return res.redirect(`/campgrounds/${id}`);
  }
  // otherwise move ahead user does have permission to change the campground
  next();
};

// After reviews authorization
// for reviews, /campgrounds/id/reviews/reviewId
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash(
      "error",
      "you do not have the permission to update the campground!"
    );
    return res.redirect(`/campgrounds/${id}`);
  }
  // otherwise move ahead user does have permission to change the campground
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  console.log("error", error);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
