var mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
    title: String,
    desc: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    }
    });
    
module.exports = mongoose.model("Todo", todoSchema);