const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

// const campgroundSchema = new Schema({
//     title: String,
//     price: Number,
//     description: String,
//     location: String
// })

//// ************************** Adding basic styling
////**************************** Adding images

// const campgroundSchema = new Schema({
//   title: String,
//   image: String,
//   price: Number,
//   description: String,
//   location: String,
// });

// module.exports = mongoose.model("Campground", campgroundSchema);

////********************************* After adding review model & middleware

// const campgroundSchema = new Schema({
//   title: String,
//   image: String,
//   price: Number,
//   description: String,
//   location: String,
//   reviews: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Review",
//     },
//   ],
// });

// //// Thing which is deleted is also passed through this function
// campgroundSchema.post("findOneAndDelete", async (doc) => {
//   // console.log("deleted");
//   // console.log(doc);
//   if (doc) {
//     await Review.deleteMany({ _id: { $in: doc.reviews } });
//   }
// });

// module.exports = mongoose.model("Campground", campgroundSchema);

////**************************** Authorization; adding author to campground
// We'll call it owner or author. And when you save a new campground, when you create one rather, we will take your current user ID,
// whatever is stored in request dot user, and save that on the campground. Then we can look you up. We can look the user up for each campground.
// at this time author field associated with campground you need to update the seeds, lets take an id of user by say db.user.find({username:shivshiv}) grab that id('66f18312c966bd1601b041cf') and put it in seeds
// so basically every campground now associated with my account

const campgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//// Thing which is deleted is also passed through this function
campgroundSchema.post("findOneAndDelete", async (doc) => {
  // console.log("deleted");
  // console.log(doc);
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
