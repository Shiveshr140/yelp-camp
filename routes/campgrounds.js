const express = require("express");
const router = express.Router();
const Campground = require(".././models/campground");
const {campgroundSchema, reviewSchema} = require(".././schemas.js")
const catchAsync = require(".././utlis/catchAsync.js")
const {validateCampground, isLoggedIn, isAuthor } = require("../middleware.js");

// const validateCampground = (req, res, next)=> {
//     const {error} = campgroundSchema.validate(req.body)
//     if(error) {
//      const msg = error.details.map(el => el.message).join(',')
//       throw new ExpressError(msg, 400);
//    }else{
//      next()
//    }
//   }

// router.get("/", catchAsync(async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render("campgrounds/index", { campgrounds });
// }));
   
// router.get("/new", catchAsync(async(req, res) => {
//     res.render("campgrounds/new");
// }));


// router.post("/", validateCampground, catchAsync(async (req, res, next) => {
//     //  if(!req.body.campground)  throw new Error("Invalid campground data", 400)
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     req.flash("success", "Successfully created a new campground!");
//     res.redirect(`/campgrounds/${campground._id}`);
// }));

// router.get("/:id", catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id).populate("reviews");
//     if(!campground){
//         req.flash('error', "Cannot found that campground!")
//         return res.redirect('/campgrounds')
//     }
//     res.render("campgrounds/show", { campground });
// }));

// //// You can not put this here because it will treat this campground/:id so order matter
// // app.get('campgrounds/new', async (res,req)=>{
// //     res.render('campgrounds/new')
// // })

// router.get("/:id/edit", catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     res.render("campgrounds/edit", { campground });
// }));

// router.put("/:id",validateCampground, catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     await Campground.findByIdAndUpdate(id, {...req.body.campground});
//     req.flash("success", "Successfuly updated campground!")
//     res.redirect(`/campgrounds/${id}`);
// }));

// router.delete("/:id", catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     req.flash("success", "Successfuly deleted campground!")
//     res.redirect("/campgrounds");
// }));



// module.exports = router;




////**************** For authentication , isLoggedIn middleware
// make changes in /new

// as this middleware is used to protect the other routes also say we do not want delete edit... etc reviews by the user who is not autheticated
// create middleware.js, add that middleware in routes where it is needed

// const validateCampground = (req, res, next)=> {
//     const {error} = campgroundSchema.validate(req.body)
//     if(error) {
//      const msg = error.details.map(el => el.message).join(',')
//       throw new ExpressError(msg, 400);
//    }else{
//      next()
//    }
//   }

// router.get("/", catchAsync(async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render("campgrounds/index", { campgrounds });
// }));
   

// // router.get("/new", catchAsync(async(req, res) => {
// //     if(!req.isAuthenticated()){
// //         req.flash('error', 'you must be signed in!')
// //         return res.redirect("/login")
// //     }
// //     res.render("campgrounds/new");
// // }));

// //// create middleware.js
// router.get("/new", isLoggedIn, catchAsync(async(req, res) => {
//      res.render("campgrounds/new");
// }));



// router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res) => {
//     //  if(!req.body.campground)  throw new Error("Invalid campground data", 400)
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     req.flash("success", "Successfully created a new campground!");
//     res.redirect(`/campgrounds/${campground._id}`);
// }));

// router.get("/:id", catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id).populate("reviews")
//     if(!campground){
//         req.flash('error', "Cannot found that campground!")
//         return res.redirect('/campgrounds')
//     }
//     res.render("campgrounds/show", { campground });
// }));

// //// You can not put this here because it will treat this campground/:id so order matter
// // app.get('campgrounds/new', async (res,req)=>{
// //     res.render('campgrounds/new')
// // })


// router.get("/:id/edit",isLoggedIn, catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     res.render("campgrounds/edit", { campground });
// }));

// router.put("/:id",isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     await Campground.findByIdAndUpdate(id, {...req.body.campground});
//     req.flash("success", "Successfuly updated campground!")
//     res.redirect(`/campgrounds/${id}`);
// }));

// router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     req.flash("success", "Successfuly deleted campground!")
//     res.redirect("/campgrounds");
// }));



// module.exports = router;



////************************************************************** Authorization
////*******************************  adding author to campground
// add username in show.ejs template
// Now we can associate currently loggedin user with campgounds /

////******************************** add campground permission 
// first do for update, what we check if author is currentUser then give it an access to update the campground



// const validateCampground = (req, res, next)=> {
//     const {error} = campgroundSchema.validate(req.body)
//     if(error) {
//      const msg = error.details.map(el => el.message).join(',')
//       throw new ExpressError(msg, 400);
//    }else{
//      next()
//    }
//   }

// router.get("/", catchAsync(async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render("campgrounds/index", { campgrounds });
// }));
   

// router.get("/new", isLoggedIn, catchAsync(async(req, res) => {
//      res.render("campgrounds/new");
// }));

// /// associate currently loggedin user
// router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res) => {
//     //  if(!req.body.campground)  throw new Error("Invalid campground data", 400)
//     const campground = new Campground(req.body.campground);
//     campground.author = req.user._id
//     await campground.save();
//     req.flash("success", "Successfully created a new campground!");
//     res.redirect(`/campgrounds/${campground._id}`);
// }));

// // populate author after authorization, to get username
// router.get("/:id", catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id).populate("reviews").populate("author");
//     // console.log(campground)
//     if(!campground){
//         req.flash('error', "Cannot found that campground!")
//         return res.redirect('/campgrounds')
//     }
//     res.render("campgrounds/show", { campground });
// }));

// //// You can not put this here because it will treat this campground/:id so order matter
// // app.get('campgrounds/new', async (res,req)=>{
// //     res.render('campgrounds/new')
// // })


// // Now you do not have persmission to update campground if manually type /edit
// router.get("/:id/edit",isLoggedIn, catchAsync(async (req, res) => {
//     const {id} = req.params
//     const campground = await Campground.findById(id);
//     if(!campground){
//         req.flash('error', "Cannot found that campground!")
//         return res.redirect('/campgrounds')
//     }
//     if(!campground.author.equals(req.user._id)){
//         req.flash('error', "you do not have the permission to update the campground!")
//         return res.redirect(`/campgrounds/${id}`)
//     }
//     res.render("campgrounds/edit", { campground });
// }));

// // now do not have persmission to update the campground if you make put request behind scene using postman
// router.put("/:id",isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id)
//     if(!campground.author.equals(req.user._id)){
//         req.flash('error', "you do not have the permission to update the campground!")
//         return res.redirect(`/campgrounds/${id}`)
//     }
//     await Campground.findByIdAndUpdate(id, {...req.body.campground});
//     req.flash("success", "Successfuly updated campground!")
//     res.redirect(`/campgrounds/${id}`);
// }));

// router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     req.flash("success", "Successfuly deleted campground!")
//     res.redirect("/campgrounds");
// }));



// module.exports = router;




////****************************** Authorization middleware
// lets move these middleware to middlware.js


// router.get("/", catchAsync(async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render("campgrounds/index", { campgrounds });
// }));
   

// router.get("/new", isLoggedIn, catchAsync(async(req, res) => {
//      res.render("campgrounds/new");
// }));

// /// associate currently loggedin user
// router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res) => {
//     //  if(!req.body.campground)  throw new Error("Invalid campground data", 400)
//     const campground = new Campground(req.body.campground);
//     campground.author = req.user._id
//     await campground.save();
//     req.flash("success", "Successfully created a new campground!");
//     res.redirect(`/campgrounds/${campground._id}`);
// }));

// // populate author after authorization, to get username
// router.get("/:id", catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id).populate("reviews").populate("author");
//     // console.log(campground)
//     if(!campground){
//         req.flash('error', "Cannot found that campground!")
//         return res.redirect('/campgrounds')
//     }
//     res.render("campgrounds/show", { campground });
// }));

// //// You can not put this here because it will treat this campground/:id so order matter
// // app.get('campgrounds/new', async (res,req)=>{
// //     res.render('campgrounds/new')
// // })


// // Now you do not have persmission to update campground if manually type /edit
// router.get("/:id/edit",isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     if(!campground){
//         req.flash('error', "Cannot found that campground!")
//         return res.redirect('/campgrounds')
//     }
//     res.render("campgrounds/edit", { campground });
// }));

// // now do not have persmission to update the campground if you make put request behind scene using postman
// router.put("/:id",isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
//     req.flash("success", "Successfuly updated campground!")
//     res.redirect(`/campgrounds/${campground._id}`);
// }));

// router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     req.flash("success", "Successfuly deleted campground!")
//     res.redirect("/campgrounds");
// }));



// module.exports = router;





////*************************************** More reviews authorization
// Suppose I made 2 reviews with 2 different ids, Alright, so now we have two different reviews, wo different user names that should be associated
// or two different user IDs rather associated with each one. So, it's similar to what we did here on a campground. We had to populate the author
// and we also populated these reviews. Take a look at routes/campgrounds.js at toute /:id, two populated fields populate("reviews").populate("author")
// What we wanna do now is instead, or in addition, rather for each one of those reviews that we're populating, we wanna populate its author.
// So, we have two different authors, right? This is the author of the campground we're populating, we wanna populate the author of each review. So to do that,

// So, it's a nested populate. We're saying populate all the reviews from the reviews array on the one campground we're finding.
// Remember, this is for the show page. So we have the campground, hopefully that we're finding, populate the reviews, then populate on each one of them, their author,
// and then separately populate the one author on this campground.
// If this app took of we might think of storing username in reviews in campg.. bcs thats the only thing we need 

// It's really not a big deal. But just keep that in mind, these are the sort of questions you need to ask yourself. How am I using this data?
// Does it make sense to, you know, populate every author on every review? What would be smarter on a larger app at the very least is to limit the number of reviews
// that we get at any given point. Because if a campground has like, thousands of reviews, it's a popular one, we definitely don't want to get all of them at once
// and populate all of their authors. That's just unnecessary. We would limit it to, you know, 50 or something or 20 and then paginate it
// or set up infinite scroll and get new reviews as you scroll.

// show.ejs
// also hide the delete button user does not made that review, simply can not delete it
// You do actually need to protect the delete route in reviews
// routes/reviews.js, middlware.js

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));
   

router.get("/new", isLoggedIn, catchAsync(async(req, res) => {
     res.render("campgrounds/new");
}));

/// associate currently loggedin user
router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    //  if(!req.body.campground)  throw new Error("Invalid campground data", 400)
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id
    await campground.save();
    req.flash("success", "Successfully created a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}));

// populate author after authorization, to get username
router.get("/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:"reviews",
        populate:{
            path: "author"
        }
    }).populate("author");
    console.log(campground)
    if(!campground){
        req.flash('error', "Cannot found that campground!")
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show", { campground });
}));

//// You can not put this here because it will treat this campground/:id so order matter
// app.get('campgrounds/new', async (res,req)=>{
//     res.render('campgrounds/new')
// })


// Now you do not have persmission to update campground if manually type /edit
router.get("/:id/edit",isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', "Cannot found that campground!")
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit", { campground });
}));

// now do not have persmission to update the campground if you make put request behind scene using postman
router.put("/:id",isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash("success", "Successfuly updated campground!")
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfuly deleted campground!")
    res.redirect("/campgrounds");
}));



module.exports = router;