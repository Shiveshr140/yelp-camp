const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

console.log("hi");
mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {})
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(" oh no error!!", err);
  });

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const samples = (arr) => arr[Math.floor(Math.random() * arr.length)];

//// first clear the collections
// const seedDB = async () => {
//   await Campground.deleteMany({});
//   for (let i = 0; i <= 50; i++) {
//     const random1000 = Math.floor(Math.random() * 1000);
//     const camp = new Campground({
//       location: `${cities[random1000].city} ${cities[random1000].state}`,
//       title: `${samples(descriptors)} ${samples(places)}`,
//     });
//     await camp.save();
//   }
// };

////********************************* Adding basic styling
// adding images from picsum.photos (Lorem Picsum), add discription and price also
// run this file node seeds/index.js
// lets add it to show.ejs

//// first clear the collections
// const seedDB = async () => {
//   await Campground.deleteMany({});
//   for (let i = 0; i <= 50; i++) {
//     const random1000 = Math.floor(Math.random() * 1000);
//     const price = Math.floor(Math.random() * 1600 + 10);
//     const camp = new Campground({
//       location: `${cities[random1000].city} ${cities[random1000].state}`,
//       title: `${samples(descriptors)} ${samples(places)}`,
//       image: `https://picsum.photos/400?random=${Math.random()}`,
//       description:
//         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt ratione labore hic fugiat aut! Praesentium distinctio explicabo dolore nostrum voluptatum natus accusamus et expedita. Fugiat distinctio est repellat perspiciatis quaerat?",
//       price,
//     });
//     await camp.save();
//   }
// };

// seedDB();

////************************ Authorization
// run after adding author, node seeds/index.js, then go to campgrounds routes

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i <= 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 1600 + 10);
    const camp = new Campground({
      author: "66f18312c966bd1601b041cf",
      location: `${cities[random1000].city} ${cities[random1000].state}`,
      title: `${samples(descriptors)} ${samples(places)}`,
      image: `https://picsum.photos/400?random=${Math.random()}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt ratione labore hic fugiat aut! Praesentium distinctio explicabo dolore nostrum voluptatum natus accusamus et expedita. Fugiat distinctio est repellat perspiciatis quaerat?",
      price,
    });
    await camp.save();
  }
};

seedDB();
