var mongoose = require('mongoose');

var dogSchema = new mongoose.Schema({
    name: String,
    breed: String,
    image: String,
    desc: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    comments: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
        }
        ]
    });
    
module.exports = mongoose.model("Dog", dogSchema);