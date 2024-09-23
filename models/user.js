const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// here it is little bit weird we do not specify the username and password because we are doing below
userSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
});

// this is going to add on to our schema, an username. It's gonna add on a field for password. It's gonna make sure those usernames are unique. They're not duplicated.
// It's also going to give us some additional methods that we can use.
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
