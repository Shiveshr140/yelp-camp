const express = require("express");
const router = express.Router();
const Campground = require(".././models/campground");
const {campgroundSchema, reviewSchema} = require(".././schemas.js")
const catchAsync = require(".././utlis/catchAsync.js")
const ExpressError = require(".././utlis/ExpressError")

const validateCampground = (req, res, next)=> {
    const {error} = campgroundSchema.validate(req.body)
    if(error) {
     const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400);
   }else{
     next()
   }
  }

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));
   
router.get("/new", catchAsync(async(req, res) => {
    res.render("campgrounds/new");
}));

router.post("/", validateCampground, catchAsync(async (req, res, next) => {
    //  if(!req.body.campground)  throw new Error("Invalid campground data", 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully created a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get("/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
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

router.get("/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}));

router.put("/:id",validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash("success", "Successfuly updated campground!")
    res.redirect(`/campgrounds/${id}`);
}));

router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfuly deleted campground!")
    res.redirect("/campgrounds");
}));



module.exports = router;
