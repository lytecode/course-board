const mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose"),
  Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  address: String,
  courses: []
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
