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

const campgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
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
