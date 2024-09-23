const express = require("express");
const Campground = require(".././models/campground");
const Review = require(".././models/review");
const {reviewSchema} = require(".././schemas.js")
const catchAsync = require(".././utlis/catchAsync.js")
const ExpressError = require(".././utlis/ExpressError")

const router = express.Router({mergeParams:true});

const validateReview = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body)
    console.log("error", error)
    if(error) {
      const msg = error.details.map(el => el.message).join(',')
       throw new ExpressError(msg, 400);
    }else{
      next()
    }
    }


// if you do review now this will give a new error that is reading reviews null,t says it can't read reviews on null which tells us campground is null. Why would that be null? It's not able to find a campground with this ID.
// Why is that? Well, if we look at the request.params where the ID is supposed to be, and I send this request that we just sent. There is definitely an ID in there, but why don't we have access to it? It's just empty.
// This is kind of an annoying thing. but it comes up occasionally when you're working with the express.Router. Express.Router likes to keep param separate.
// So over here, we're saying there's(app.use('/campgrounds/:id/reviews')) an ID in the path that prefixes all of these routes. But by default, we actually won't have access
// to that ID in our reviews routes. Routers get separate params and they are separate, but we can actually specify an option here
// which is mergeParams and set that to true.

router.post("/", validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success", "Created new review!")
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete( "/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!")
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router