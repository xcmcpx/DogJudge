var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

//MODEL SETUP
module.exports = mongoose.model("Blog", blogSchema);