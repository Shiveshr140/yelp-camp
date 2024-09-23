const { number } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

//// We gonna connect review model to campground this is one to many relationship
// So this is a one-to-many relationship, and we spent a lot of time talking about when to use, you know, what type of relationship or what implementation of a one-to-many.
// And what we're going to do is just embed an array of object IDs in each campground. And the reason for that is that we could theoretically
// have thousands and thousands of reviews for some of the more popular places, just like Yelp does. Now, of course, we're not going to have thousands of reviews unless somebody decides to make a whole bunch of reviews.
// We're likely just gonna have a couple on each but there's the potential there. So instead of directly embedding them
// in a single campground, the entire review, we're instead going to break them out into their own model like we've done and store the object IDs in a campground.

// That means we need to update our campground.js

const reviewSchema = new Schema({
  body: String,
  rating: Number,
});

module.exports = mongoose.model("Review", reviewSchema);
