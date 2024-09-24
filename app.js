const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate")
const ExpressError = require("./utlis/ExpressError")
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')
const campgroundRoutes = require("./routes/campgrounds.js")
const reviewRoutes = require("./routes/reviews.js")
const userRoutes = require("./routes/users.js")

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



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

// And we need to tell Expressn that's the one we want to use instead of the default one it's relying on. So, we should just be able to access our content
// like normal. Nothing has changed, it's still just regular old ejs. But now I can define a layout file.
app.engine("ejs", ejsMate)
app.set("view engine", "ejs");


const sessionConfig = {
  secret: 'Thisisgoingtobeasecretkey', 
  resave:true, 
  saveUninitialized: true,
  // store: //ryt now it local memoey later on its gonna be database
  // fancier cookie, httpOnly will add new layer of security read docs, it  guess the default is to enable it, but we're just explicitly gonna set http only to true. And according to this spec here or this document, it explains that if this flag is included on a cookie, the cookie cannot be accessed through client side scripts and as a result, even if cross-site scripting which is really not something we've discussed yet, but even if that flaw exists and a user accidentally accesses a link that exploits this flaw, the browser will not reveal the cookie to a third party. It's just a a little extra security thing that we should add in.
  cookies:{
    httpOnly: true,
    expires: Date.now() + 1000*60*24*7,
    maxAge:  1000*60*24*7,
  }
}

app.use(session(sessionConfig))

app.use(flash())

// session should be used before passport.session
app.use(passport.initialize())
app.use(passport.session())       // for persistent log in
// hello passports, we would like you to use the local strategy that we have downloaded and required and for that local strategy
// the authentication method is going to be located on our user model and it's called authenticate. On the docs for that it tells us these are the static methods that have been added in automatically.
// Authenticate, right there, generates a function that is used in passport's local strategy.
passport.use(new LocalStrategy(User.authenticate()))

// This is telling passport how to serialize a user. And serialization refers to basically, how do we store a user in the session.
passport.serializeUser(User.serializeUser())
// And then the opposite, deserialize, how do you get a user out of that session
passport.deserializeUser(User.deserializeUser())

// So whatever strategy we're using, in this case we're telling passport to use local strategy. We can have multiple strategies going at once
// but in this case, just this one. We need to specify the authentication method, which was added for us automatically. I didn't have to write that.
// And how to deserialize and serialize a user. Basically how to store it and unstore it in this session. And those are two methods(se/dese) that we're specifying here,
// On our user model, they've also been added in automatically for us.


//// flash middleware, so that we do not have to pass it throw every res.render(), every templates have automatically access to this variable
app.use((req, res, next)=>{
  //returnTo behaviour, after trying /new w/o login session will have returnTo 
  console.log(req.session) 
  // res.locals.returnTo = req.session
  // after adding passport, for showing/hiding logout button
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

// so on every single request use this middleware morgan, same for other middleware also
app.use(morgan("tiny"));

app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)
app.use("/", userRoutes)









////********************************  Basic Crud Functionality
// While you can technically use POST for any action, using PUT and DELETE is about following standards and making your API clear, consistent, and predictable. It aligns with RESTful principles and makes your API more understandable and easier to use.

// app.get("/", (req, res) => {
//   res.send("hi");
// });

// app.get("/campgrounds", async (req, res) => {
//   const campgrounds = await Campground.find({});
//   res.render("campgrounds/index", { campgrounds });
// });

// app.get("/campgrounds/new", async (req, res) => {
//   res.render("campgrounds/new");
// });

// app.post("/campgrounds", async (req, res) => {
//   const campground = new Campground(req.body.campground);
//   await campground.save();
//   res.redirect(`/campgrounds/${campground._id}`);
// });

// app.get("/campgrounds/:id", async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/show", { campground });
// });

// //// You can not put this here because it will treat this campground/:id so order matter
// // app.get('campgrounds/new', async (res,req)=>{
// //     res.render('campgrounds/new')
// // })

// app.get("/campgrounds/:id/edit", async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/edit", { campground });
// });

// app.put("/campgrounds/:id", async (req, res) => {
//   const { id } = req.params;
//   await Campground.findByIdAndUpdate(id, {
//     ...req.body.campground,
//   });

//   res.redirect(`/campgrounds/${id}`);
// });

// app.delete("/campgrounds/:id", async (req, res) => {
//   const { id } = req.params;
//   await Campground.findByIdAndDelete(id);
//   res.redirect("/campgrounds");
// });

// app.listen(3000, () => {
//   console.log("listening to the port 3000!!");
// });

///**********************************  Adding Middlewares
// Refer to pdf

////*****************  Adding a external middleware Logger morgan middleware
// It's very simple. All that it does is it helps us log HTP requests information to our terminal. So, this is actually really useful
// when you're debugging things, and just, it's something a lot of people like to include when they're developing an app.
// we do need to install morgan if we want to use it, just like any other package. So, we'll run "npm install morgan".

// App dot use allows us to run code on every single request. And, this is something we do all the time, right, express dot static.
// This is telling Express to use the or, to serve static files on every request. We've also seen, what, express dot jSON. That's telling Express to parse the body as jSON
// on every request. Express dot urlencoded, that's telling Express every single request,

// It can be very useful, especially when you're sending requests and you're not getting the response you expect, you're not getting anything,
// and you want to know, you know, what request just came in. Well, you can use morgan to help you.

// So all I wanna show is that whatever function you put in an app.use will be called for every single request
// app.use((req, res)=>res.send("Hey use my app!!!"))



////********************************** Writting your own middleware
// We often  wants to call the next middleware, for more guide go to https://expressjs.com/en/guide/writing-middleware.html
// app.get('/', function(req, res, next)), function signature rather for defining middleware, where we have the request, the response,
// and then a third parameter that will be passed automatically which is called, well, usually called next. next is just going to refer
// to whatever that next thing is, it will be executed.
// Remember res.send stops everything in that rout so i we do

// app.use("/", (req, res, next)=>{
//   res.send("hi")
//   it will not run
//   next()
// })

// you can do this, this will run whatever comes next may be another middleware app.use() or routes app.get("/")
// app.use("/", (req, res, next)=>{
//   console.log("This is my first middleware")
//   next()
// })

// If do not use next() then this is the end of the line i.e console.log("This is my first middleware"), it will not run even if the rout matches for e.g /campgrounds 
// app.use("/", (req, res, next)=>{
//   console.log("This is my first middleware")
// })

// Now if we log something after next in same app.use then that will not log it immediately means not in order as next() will search next middle ware first.
// This is my first middleware
// This is my second middleware
// This is my first middleware after calling next
// GET /campgrounds 200 5975 - 34.332 ms

// app.use("/", (req, res, next)=>{
//   console.log("This is my first middleware")
//  next()
//  console.log("This is my first middleware after calling next")
// })

// app.use("/", (req, res, next)=>{
//   console.log("This is my second middleware")
//   next()
// })

// But what we generally do is use return before next() that nothing after next() in same app.use will run

// app.get("/", (req, res) => {
//   res.send("hi");
// });

// app.get("/campgrounds", async (req, res) => {
//   const campgrounds = await Campground.find({});
//   res.render("campgrounds/index", { campgrounds });
// });

// app.get("/campgrounds/new", async (req, res) => {
//   res.render("campgrounds/new");
// });

// app.post("/campgrounds", async (req, res) => {
//   const campground = new Campground(req.body.campground);
//   await campground.save();
//   res.redirect(`/campgrounds/${campground._id}`);
// });

// app.get("/campgrounds/:id", async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/show", { campground });
// });

// //// You can not put this here because it will treat this campground/:id so order matter
// // app.get('campgrounds/new', async (res,req)=>{
// //     res.render('campgrounds/new')
// // })

// app.get("/campgrounds/:id/edit", async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/edit", { campground });
// });

// app.put("/campgrounds/:id", async (req, res) => {
//   const { id } = req.params;
//   await Campground.findByIdAndUpdate(id, {
//     ...req.body.campground,
//   });

//   res.redirect(`/campgrounds/${id}`);
// });

// app.delete("/campgrounds/:id", async (req, res) => {
//   const { id } = req.params;
//   await Campground.findByIdAndDelete(id);
//   res.redirect("/campgrounds");
// });

// app.listen(3000, () => {
//   console.log("listening to the port 3000!!");
// });




//// ******************************************* More practice on middleware
// Using middleware we can access information from the request and we can modify or add data to the request object before any of our route handlers are executed.

// Lets implement morgan by own so comment app.use(morgan('tiny))
// This will do what morgan does
// app.use((req,res,next)=>{
//   console.log(req.method, req.path)
//   next()
// })

// we can make very request a say GET request if we want it to, this we will probably never do
// app.use((req,res,next)=>{
//   req.method = 'GET'
//   console.log(req.method.toUpperCase(), req.path)
//   next()
// })


//// every routhandler will have access to  req.requestTime
// app.use((req,res,next)=>{
//   req.requestTime = Date.now()
//   console.log(req.method.toUpperCase(), req.path)
//   next()
// })

// app.get("/", (req, res) => {
//   console.log(`The Requested Time: ${req.requestTime}`)
//   res.send("hi");
// });



////********************************** Setting up 404 route
// So, we've been using app.use and just passing a function, and that's it. And it will run for every single incoming request,
// every single verb, get, post, patch, and so on. But, according to the docs, we can also passing a string for a path to match,
// just like we do with our route handlers.

// app.use("/campgrounds", (req, res, next)=>{
//   console.log('I love dogs')  // this will only run if /campgrounds, /campgrounds/:id ..etc come, it must contain /campgrounds in the route path
//   next()
// })

// If any of the routes didn't match then we want error message then we can use app.use and pass our middle ware but that should be at the end
// The other thing that we probably would do for a typical 404 is call res.status, which allows us to change the status code to be 404, for not found,
// and then send the text of not found. And you'll probably, in a real nice consumer facing application, we would have a polished 404 template that we would render,
// instead of just sending back not found.



////************************************** Password middleware Demo: fake
// Not really usefull, here you need to provide the query with correct password then only next() will run, localhost:300/?password=shiv
// app.use((req,res,next)=>{
//   if(req.query.password==="shiv"){
//     next()
//   }
//   res.send("Sorry we need a password😒")
// })



///// ************************************** Protecting specific route
// one way not the best way

// // app.use((req,res,next)=>{
// //   if(req.path==='/'){
// //     if(req.query.password==="shiv"){
// //     next()
// //     }
// //     res.send("Sorry we need a password😒")
// //   }
// //   next()
// // })

// // Other way is using app.get(), when we define an app dot get, when we call it, we pass in a path and optionally multiple callback functions
// // can be called or can be passed in. So we can pass in multiple callback functions that behave just like middleware to our actual routes.

// // const verifyPassword = (req,res,next)=>{
// //   if(req.query.password==="shiv"){
// //     next()
// //   }
// //   res.send("Sorry we need a password😒")
// // }

// // Now this verifypassword is middleware it has next so it will call next middleware or this callback (req, res)
// // app.get('/secret', verifyPassword, (req, res)=>{
// //   res.send("My secret is hardwork")
// // })


// app.get("/", (req, res) => {
//   res.send("hi");
// });

// app.get("/campgrounds", async (req, res) => {
//   const campgrounds = await Campground.find({});
//   res.render("campgrounds/index", { campgrounds });
// });

// app.get("/campgrounds/new", async (req, res) => {
//   res.render("campgrounds/new");
// });

// app.post("/campgrounds", async (req, res) => {
//   const campground = new Campground(req.body.campground);
//   await campground.save();
//   res.redirect(`/campgrounds/${campground._id}`);
// });

// app.get("/campgrounds/:id", async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/show", { campground });
// });

// //// You can not put this here because it will treat this campground/:id so order matter
// // app.get('campgrounds/new', async (res,req)=>{
// //     res.render('campgrounds/new')
// // })

// app.get("/campgrounds/:id/edit", async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/edit", { campground });
// });

// app.put("/campgrounds/:id", async (req, res) => {
//   const { id } = req.params;
//   await Campground.findByIdAndUpdate(id, {
//     ...req.body.campground,
//   });

//   res.redirect(`/campgrounds/${id}`);
// });

// app.delete("/campgrounds/:id", async (req, res) => {
//   const { id } = req.params;
//   await Campground.findByIdAndDelete(id);
//   res.redirect("/campgrounds");
// });

// app.use((req,res)=>{
//   // res.send("Not Found")
//   res.status(404).send("NOT FOUND")
// })

// app.listen(3000, () => {
//   console.log("listening to the port 3000!!");
// });







////************************************** Adding basic styling

//*************************** New EJS tool for layout  
// npm i ejs-mate and intergate with app
// create a layout forder make boilerplate.ejs and edit every ejs file

//********************* Adding BootStrap
// partials => navbar.ejs, footer.ejs

//************************* Addings images
// go to campground.js and update schema i.e add image field
// add this `https://picsum.photos/400?random=${Math.random()}` in seeds/index.js
// Go to show.ejs add image, descriptions

//**********************  Styling Campground Index
//campgrounds/index.ejs

//****************************** Styling the New Form 
// campgrounds/new.ejs

//// *************************************** Styling the edit form
// campgrounds/edit.ejs 


// app.get("/", (req, res) => {
//   res.send("hi");
// });

// app.get("/campgrounds", async (req, res) => {
//   const campgrounds = await Campground.find({});
//   res.render("campgrounds/index", { campgrounds });
// });

// app.get("/campgrounds/new", async (req, res) => {
//   res.render("campgrounds/new");
// });

// app.post("/campgrounds", async (req, res) => {
//   const campground = new Campground(req.body.campground);
//   await campground.save();
//   res.redirect(`/campgrounds/${campground._id}`);
// });

// app.get("/campgrounds/:id", async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/show", { campground });
// });

// //// You can not put this here because it will treat this campground/:id so order matter
// // app.get('campgrounds/new', async (res,req)=>{
// //     res.render('campgrounds/new')
// // })

// app.get("/campgrounds/:id/edit", async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/edit", { campground });
// });

// app.put("/campgrounds/:id", async (req, res) => {
//   const { id } = req.params;
//   await Campground.findByIdAndUpdate(id, {
//     ...req.body.campground,
//   });

//   res.redirect(`/campgrounds/${id}`);
// });

// app.delete("/campgrounds/:id", async (req, res) => {
//   const { id } = req.params;
//   await Campground.findByIdAndDelete(id);
//   res.redirect("/campgrounds");
// });

// app.use((req,res)=>{
//   // res.send("Not Found")
//   res.status(404).send("NOT FOUND")
// })

// app.listen(3000, () => {
//   console.log("listening to the port 3000!!");
// });



//// **************************** handling errors
// seperate  folder for this 


////**************************************** Errors and validating the data

//************ Client side form validation
// Client side validation
// "required" attribute is used for validating the field, that is done by browser so it will vary from browser to browser client side validation
// new.ejs, boilerplate.ejs edit.ejs


//************ Basic error handler
// lets add error handler middleware
// To verify that if it is working try to update with price in string instead of number

// app.get("/", (req, res) => {
//   res.send("hi");
// });

// app.get("/campgrounds", async (req, res) => {
//   const campgrounds = await Campground.find({});
//   res.render("campgrounds/index", { campgrounds });
// });

// app.get("/campgrounds/new", async (req, res) => {
//   res.render("campgrounds/new");
// });

// app.post("/campgrounds", async (req, res, next) => {
//   try {
//    const campground = new Campground(req.body.campground);
//    await campground.save();
//    res.redirect(`/campgrounds/${campground._id}`);
//   } catch (e) {
//     next(e)
//   }
// });

// app.get("/campgrounds/:id", async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/show", { campground });
// });

// //// You can not put this here because it will treat this campground/:id so order matter
//// app.get('campgrounds/new', async (res,req)=>{
////     res.render('campgrounds/new')
////  })

// app.get("/campgrounds/:id/edit", async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/edit", { campground });
// });

// app.put("/campgrounds/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//   await Campground.findByIdAndUpdate(id, {
//     ...req.body.campground,
//   });
//   res.redirect(`/campgrounds/${id}`);
//    } catch (error) {
//     next(error)
//   }
// });

// app.delete("/campgrounds/:id", async (req, res) => {
//   const { id } = req.params;
//   await Campground.findByIdAndDelete(id);
//   res.redirect("/campgrounds");
// });

// app.use((err, req, res, next)=>{
//   res.send("Something went wrong!!!")
// })

// app.use((req,res)=>{
//   // res.send("Not Found")
//   res.status(404).send("NOT FOUND")
// })

// app.listen(3000, () => {
//   console.log("listening to the port 3000!!");
// });




////******************************************** Defining Error handling class 
// form utlis, ExpressError.js
// Wrap all async routes with this catchAsync


////******************************** Add more Errors  

//// Add 404 for unrecognised route
// If you try and request some URL we don't recognize and the easiest way is to do that just at the very end, app dot, and then in here we could do a get,
// we could do, you know, post, but I'm gonna do an app.all which is for every single request.

//// Add 400 in post:/campgrounds
// Though we are handling it client cide but still it will stop someone to send the post request you can go and check the postman it will create an empty campground
// We can do a simple check and again we have throw an err as we are inside an aync function then only catchAsyn will catch and pass to to the next()
// shortly we will handle it at mongoose


////******************************** Defining Error Template
// create error.ejs and modify app.use((err, req, res, next))



// app.get("/campgrounds", catchAsync(async (req, res) => {
//   const campgrounds = await Campground.find({});
//   res.render("campgrounds/index", { campgrounds });
// }));

// app.get("/campgrounds/new", catchAsync(async(req, res) => {
//   res.render("campgrounds/new");
// }));

// app.post("/campgrounds", catchAsync(async (req, res, next) => {
//    if(!req.body.campground)  throw new Error("Invalid campground data", 400)
//    const campground = new Campground(req.body.campground);
//    await campground.save();
//    res.redirect(`/campgrounds/${campground._id}`);
// }));

// app.get("/campgrounds/:id", catchAsync(async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/show", { campground });
// }));

// //// You can not put this here because it will treat this campground/:id so order matter
// // app.get('campgrounds/new', async (res,req)=>{
// //     res.render('campgrounds/new')
// // })

// app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/edit", { campground });
// }));

// app.put("/campgrounds/:id", catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   await Campground.findByIdAndUpdate(id, {
//     ...req.body.campground,
//   });
//   res.redirect(`/campgrounds/${id}`);
 
// }));

// app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
//   const { id } = req.params;
//   await Campground.findByIdAndDelete(id);
//   res.redirect("/campgrounds");
// }));

// app.use((err, req, res, next)=>{
//   res.send("Something went wrong!!!")
//   next()
// })

// //// It will check all routes, and it will only run none of above routes matches
// // Generically saying
// // app.all("*", (req, res, next)=>{
// //    res.status(404).send("Url not matched ☹️")
// // })

// // app.use((req,res)=>{
// //   // res.send("Not Found")
// //   res.status(404).send("NOT FOUND")
// // })


// //// It will check all routes, and it will only run none of above routes matches
// app.all("*", (req, res, next)=>{
//   next(new ExpressError("Page Not Found!!!", 404))
// })

// // app.use((err, req, res, next)=>{
// //   const {statusCode=500, message="Something went wrong!!"} = err;
// //   res.status(statusCode).send(message)
// // })

// app.use((err, req, res, next)=>{
//   const {statusCode=500} = err;
//   if(!err.message) err.message = "Something went wrong!!"
//   res.status(statusCode).render("error.ejs", {err})
// })

// app.listen(3000, () => {
//   console.log("listening to the port 3000!!");
// });








////********************************** JOI Schema validation
// Now handle this in a prefect way
// Though we are handling it client cide but still it will stop someone to send the post request you can go and check the postman it will create an empty campground
// So we're not going to write our own validations, we're gonna use a tool that's been made to do just that, it's something called joi, J-O-I.
// It's not Express specific it's just a JavaScript validator tool.

// you define a schema for something, some data in JavaScript. So for us, our schema will basically be for the request.body, and we can validate,
// we can make sure that campground is there as an object.

// "npm i joi"

// app.get("/campgrounds", catchAsync(async (req, res) => {
//   const campgrounds = await Campground.find({});
//   res.render("campgrounds/index", { campgrounds });
// }));

// app.get("/campgrounds/new", catchAsync(async(req, res) => {
//   res.render("campgrounds/new");
// }));

// app.post("/campgrounds", catchAsync(async (req, res, next) => {
//   //  if(!req.body.campground)  throw new Error("Invalid campground data", 400)

//   ////  So I'm gonna define my basic schema, I'm gonna call this campgroundSchema. Now this is not a Mongoose schema, okay, this is going to validate our databefore we even attempt to save it with Mongoose
//   const campgroundSchema = Joi.object({
//     campground: Joi.object({
//       title: Joi.string().required(),
//       price: Joi.number().required().min(0),
//       image: Joi.string().required(),
//       location: Joi.string().required(),
//       description: Joi.string().required(),
//     }).required()
//   });
//    // And then once we have our schema defined, all we do is pass our data through to the schema. So that looks like this, schema, so campgroundSchema.validate request.body.
//    const {error} = campgroundSchema.validate(req.body)
//    if(error) {
//     const msg = error.details.map(el => el.message).join(',')
//      throw new ExpressError(msg, 400);
//   }
//    console.log(result)
   
//    const campground = new Campground(req.body.campground);
//    await campground.save();
//    res.redirect(`/campgrounds/${campground._id}`);
// }));

// app.get("/campgrounds/:id", catchAsync(async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/show", { campground });
// }));

// //// You can not put this here because it will treat this campground/:id so order matter
// // app.get('campgrounds/new', async (res,req)=>{
// //     res.render('campgrounds/new')
// // })

// app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/edit", { campground });
// }));

// app.put("/campgrounds/:id", catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   await Campground.findByIdAndUpdate(id, {
//     ...req.body.campground,
//   });
//   res.redirect(`/campgrounds/${id}`);
 
// }));

// app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
//   const { id } = req.params;
//   await Campground.findByIdAndDelete(id);
//   res.redirect("/campgrounds");
// }));


// //// It will check all routes, and it will only run none of above routes matches
// // Generically saying
// // app.all("*", (req, res, next)=>{
// //    res.status(404).send("Url not matched ☹️")
// // })

// // app.use((req,res)=>{
// //   // res.send("Not Found")
// //   res.status(404).send("NOT FOUND")
// // })


// //// It will check all routes, and it will only run none of above routes matches
// app.all("*", (req, res, next)=>{
//   next(new ExpressError("Page Not Found!!!", 404))
// })

// // app.use((err, req, res, next)=>{
// //   const {statusCode=500, message="Something went wrong!!"} = err;
// //   res.status(statusCode).send(message)
// // })

// app.use((err, req, res, next)=>{
//   const {statusCode=500} = err;
//   if(!err.message) err.message = "Something went wrong!!"
//   res.status(statusCode).render("error.ejs", {err})
// })

// app.listen(3000, () => {
//   console.log("listening to the port 3000!!");
// });




////**************************  JOI middleware
//// Lets make it reusable, I do not want to use app.use thhat will apply it to all route, I want this to be selectively applied

//// as it is aa middleware so req, res, next
// const validateCampground = (req, res, next)=> {
//    const {error} = campgroundSchema.validate(req.body)
//    if(error) {
//     const msg = error.details.map(el => el.message).join(',')
//      throw new ExpressError(msg, 400);
//   }else{
//     next()
//   }
// }



// app.get("/campgrounds", catchAsync(async (req, res) => {
//   const campgrounds = await Campground.find({});
//   res.render("campgrounds/index", { campgrounds });
// }));

// app.get("/campgrounds/new", catchAsync(async(req, res) => {
//   res.render("campgrounds/new");
// }));

// app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
//   //  if(!req.body.campground)  throw new Error("Invalid campground data", 400)
//   const campground = new Campground(req.body.campground);
//    await campground.save();
//    res.redirect(`/campgrounds/${campground._id}`);
// }));

// app.get("/campgrounds/:id", catchAsync(async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/show", { campground });
// }));

// //// You can not put this here because it will treat this campground/:id so order matter
// // app.get('campgrounds/new', async (res,req)=>{
// //     res.render('campgrounds/new')
// // })

// app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
//   const campground = await Campground.findById(req.params.id);
//   res.render("campgrounds/edit", { campground });
// }));

// app.put("/campgrounds/:id",validateCampground, catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   await Campground.findByIdAndUpdate(id, {
//     ...req.body.campground,
//   });
//   res.redirect(`/campgrounds/${id}`);
 
// }));

// app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
//   const { id } = req.params;
//   await Campground.findByIdAndDelete(id);
//   res.redirect("/campgrounds");
// }));



// //// It will check all routes, and it will only run none of above routes matches
// app.all("*", (req, res, next)=>{
//   next(new ExpressError("Page Not Found!!!", 404))
// })


// app.use((err, req, res, next)=>{
//   const {statusCode=500} = err;
//   if(!err.message) err.message = "Something went wrong!!"
//    res.status(statusCode).render("error.ejs", {err})
// })


// app.listen(3000, () => {
//   console.log("listening to the port 3000!!");
// });



//// *********************************************************MongoDB Relationships 
// seperate file, refer to pdf


//// ********************************************************** Adding Review Model

///**************************** Defining review model
// Create reviews.js in models
// Update campground.js in models


////************************* Adding review form 
// go to campground/show.ejs


////************************** Creating a review 
// add a route campground/:id/review


////****************************** Validating reviews
// First client side validation => campground/show.ejs
// for server side add anothere schema in schemas.js

////************************ Display the reviews
// populate GET campgrounds/:id

////************************* Deleting the reviews
// add new route campgrounds/:id/reviews/:reviewId, add delete button in show.ejs
// Here we are gonna use the $pull operator first find the doc with id then pull that specific part in that doc
// remove from array Mongo, it's the recommended solution.


////**************************** Campground delete middleware
// If I add say LOL many times and I delete the campground then these reviews will still be in the database and they are not be used anymore. 
// particular method trigger specific query middleware say findByIdAndDelete will trigger the FindOneAndDelete.
// If want to delete campground so its all reviews must also be deleted from reviews collection thats why we use middleware


// const validateCampground = (req, res, next)=> {
//   const {error} = campgroundSchema.validate(req.body)
//   if(error) {
//    const msg = error.details.map(el => el.message).join(',')
//     throw new ExpressError(msg, 400);
//  }else{
//    next()
//  }
// }

// const validateReview = (req, res, next)=>{
//   const {error} = reviewSchema.validate(req.body)
//   console.log("error", error)
//   if(error) {
//     const msg = error.details.map(el => el.message).join(',')
//      throw new ExpressError(msg, 400);
//   }else{
//     next()
//   }
//   }


// app.get("/campgrounds", catchAsync(async (req, res) => {
//  const campgrounds = await Campground.find({});
//  res.render("campgrounds/index", { campgrounds });
// }));

// app.get("/campgrounds/new", catchAsync(async(req, res) => {
//  res.render("campgrounds/new");
// }));

// app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
//  //  if(!req.body.campground)  throw new Error("Invalid campground data", 400)
//  const campground = new Campground(req.body.campground);
//   await campground.save();
//   res.redirect(`/campgrounds/${campground._id}`);
// }));

// app.get("/campgrounds/:id", catchAsync(async (req, res) => {
//  const campground = await Campground.findById(req.params.id).populate("reviews");
//  console.log(campground)
//  res.render("campgrounds/show", { campground });
// }));

// //// You can not put this here because it will treat this campground/:id so order matter
// // app.get('campgrounds/new', async (res,req)=>{
// //     res.render('campgrounds/new')
// // })

// app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
//  const campground = await Campground.findById(req.params.id);
//  res.render("campgrounds/edit", { campground });
// }));

// app.put("/campgrounds/:id",validateCampground, catchAsync(async (req, res, next) => {
//  const { id } = req.params;
//  await Campground.findByIdAndUpdate(id, {...req.body.campground});
//  res.redirect(`/campgrounds/${id}`);
// }));

// app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
//  const { id } = req.params;
//  await Campground.findByIdAndDelete(id);
//  res.redirect("/campgrounds");
// }));

// app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async(req, res)=>{
//     const campground = await Campground.findById(req.params.id)
//     const review = new Review(req.body.review)
//     campground.reviews.push(review)
//     await campground.save()
//     await review.save()
//     console.log("review", review)
//     console.log("campground", campground)
//     res.redirect(`/campgrounds/${campground._id}`)
// }))

// app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async (req, res)=> {
//    const {id, reviewId} = req.params;
//    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
//    await Review.findByIdAndDelete(reviewId)
//    res.redirect(`/campgrounds/${id}`)
// }))


// //// It will check all routes, and it will only run none of above routes matches
// app.all("*", (req, res, next)=>{
//  next(new ExpressError("Page Not Found!!!", 404))
// })


// app.use((err, req, res, next)=>{
//  const {statusCode=500} = err;
//  if(!err.message) err.message = "Something went wrong!!"
//   res.status(statusCode).render("error.ejs", {err})
// })


// app.listen(3000, () => {
//  console.log("listening to the port 3000!!");
// });




////************************************************ Restructuring & Flash

////************************* Cookies, Session, Flash
// Another file


//*************************** Breaking out campground routes
// make routes/campgrounds.js

//*************************** Breaking out campground routes
// make routes/reviews.js


//*************************** Serving static assets
// make public/javascripts/valiadteForms.js

//***************************** Configuring session & Setting up flash

//****************************** Flash Success Partial && Flash Error Partials
// make partials/flash.ejs
// To produce the errors, say you booked a particular campground and somebody deleted it then here things will go wrong.
// Go to campgrounds.js 


// app.all("*", (req, res, next)=>{
//  next(new ExpressError("Page Not Found!!!", 404))
// })


// app.use((err, req, res, next)=>{
//  const {statusCode=500} = err;
//  if(!err.message) err.message = "Something went wrong!!"
//   res.status(statusCode).render("error.ejs", {err})
// })


// app.listen(3000, () => {
//  console.log("listening to the port 3000!!");
// });




////************************************* Authentication from Scratch
//// New folder


////************************************** Adding authentication to Yelp camp
////******************* Intro to passport
// We're going to be using a tool called Passport which is a library. It's very popular and it helps you add authentication into node apps.

// But what's really cool about it and I mentioned this a while ago is that it also comes with a bunch of possible strategies, different ways or services to log someone in using.
// So that could be Facebook login, Twitter login, Google login, or it could be local login which is what we're gonna begin with. But I want to use this and I recommend using something
// like Passport because it can grow with your app. If you decide we also wanna support Twitter login, and I don't know, Google login, you can add that using Passport and it's relatively easy.

// If instead you had implemented your own auth from Scratch like we've already done and we do that with Yelp camp and then you decide, I also want Twitter login,
// it's kind of a huge headache to be honest with you. So if we get into this passport ecosystem, it's way simpler for you to change your mind
// or to add on cooler or I shouldn't say cooler, but other login strategies.

// So we're gonna use Passport Local which is one strategy, but in addition, there's actually a specialized tool Passport Local Mongoose
// which makes it even easier if we're using a Mongoose database. So we're going to install all three of those. If we wanna use Passport Local Mongoose
// it does require Passport Local and that requires Passport. And then again later on you could add on Passport Facebook and passport Twitter if you wanted to.
// "npm i passport passport-local passport-local-mongoose"

////************************* Create user model
// create user.js in models

////**************************** Configuring Passport into our app 
// const passport = require('passport') => this allow us to plugin multiple startegiest of authentication
// lets make temprory route fake user you can see we will have additional fields as hash, salt etc automatically added


////****************************** Register form and register route logic
// make a new file in routes users.js

////***************************** Login routes
// users.js

////**************************** isLoggedln middleware 
// So now that we have the ability to log in, let's protect one of our basic routes, like making a new campground. You can't submit a new campground
// unless you are currently signed in. So how are we going to do that? Well, there's a couple of things. One, we need to know or be able to check
// if somebody is currently signed in or if they are authenticated.

// Now, when we did our auth from scratch, we would store a user ID or something similar in the session, and just look for that.
// And we could do something like that ourself, but Passport actually gives us a helper method. It uses the session to be clear
// and it stores its own stuff in there. And that's the whole serialize and deserialize user, if you remember those.That all has to do with how information is stored
// and retrieved from the session. Anyway, what we can do is use this helper method that comes from Passport, it's called, isAuthenticated and it's automatically added to the request object itself.

// Go to campgrounds.js in routes and do changes in /new, and create a middlware.js 

////******************************* Adding Logout
// let's give the user the ability to logout, it seems somewhat important. And with Passport it's actually very easy. There is a method added to our request object automatically
// called login, there's also logout.
// add route in user.js in routes
// add some links in navbar in navbar.ejs


////****************************** currentUser Helper
// We wanna show these user links depending upon whether they logged in or not, how we know if someone is logged in. Currently, Passport is just taken care of,
// basically giving us this nice method, isAuthenticated, but how can I easily get access to the actual user itself, the object or the ID or something around the user? Well, it's really easy.
// There is something on the request called user, to automatically put there for us, request.user. So that will contain information about the user.
// it is going to be automatically filled in with the deserialized information from the session. So the session stores the serialized user,
// Passport is going to deserialize, unserialize it and fill in request.user with that data.
// just like I made flash i.e success and error available to to every request you can make req.user also add that too

////*********************************** Fixing register route
// Now when we register it will directly take you to /campgrounds w/o log in fix that
// And the way that we do this is there's a helper method called login on our request. We also had req.logout. We have a req.login.
// It's from Passport, and it establishes a login session. And it says passport.authenticate, the middleware automatically does this for us.
// This is primarily used when users register or sign up when we can invoke login to automatically log in the newly registered user.
// And that's exactly what we want.
// make changes in /register route


////******************************** Fixing registeration
// So the final thing we should tackle, at least in terms of our basic authentication functionality is redirecting a user back
// to wherever they were trying to go. So if I try and go edit this page right now, Silent Ghost Town, I'm not signed in. I have to log in.
// So I'll log in, but then it just takes me back to the index to all campgrounds, and that's kind of annoying.
// So what we could do is keep track of where a user was initially requesting when we're trying to log them in here or when we are verifying that they are authenticated.
// If they're not, we could basically just store the URL they are requesting and then redirect back to the login,
// Go to middleware.js, Inclue that req.session.returnTo in here app.use also


// app.get("/fakeuser", async (req,res)=>{
//   const user = new User({emal: 'shivr@gmail.com', username:"shiv140"})
//   // I'm gonna do next is called the register method, which is provided as a helper thanks to our passport local mongoose, mongoose plugin. Convenience method to register
//   // a new user instance for the given password. Also checks if username is unique, and it's going to hash that password, store it
//   const newUser = await User.register(user, "shrr")
//   res.send(newUser)
// })

app.all("*", (req, res, next)=>{
  next(new ExpressError("Page Not Found!!!", 404))
 })
 
 
 app.use((err, req, res, next)=>{
  const {statusCode=500} = err;
  if(!err.message) err.message = "Something went wrong!!"
   res.status(statusCode).render("error.ejs", {err})
 })
 
 
 app.listen(3000, () => {
  console.log("listening to the port 3000!!");
 });