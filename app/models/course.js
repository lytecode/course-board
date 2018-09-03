const mongoose = require("mongoose");
Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: String
});

module.exports = mongoose.model("Course", courseSchema);
