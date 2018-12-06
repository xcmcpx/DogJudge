var Dog = require("../models/dog");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkDogOwner = function(req, res, next) {
 if(req.isAuthenticated()){
        Dog.findById(req.params.id, function(err, foundDog){
           if(err || !foundDog){
               req.flash("error", "Dog not found error: I don't seem to have a record of that in the database. Yikes.");
               res.redirect("back");
           }  else {
               // does user own the Dog?
            if(foundDog.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Not high enough security access champ. Better luck next time.");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "AcCeSS DeNIEd - please log in to even attempt to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwner = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "YOU BLEW IT!!! I couldn't find that comment.");
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You're trying to be slick and censor someone else's online opinion that I have record of. Don't own it, don't control it.");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "Now now, at least attempt to log in before you expect more from me.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Looks like you don't have the access. You can fix that by signing up or logging in to my system. :)");
    res.redirect("/login");
}

module.exports = middlewareObj;