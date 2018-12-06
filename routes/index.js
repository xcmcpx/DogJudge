var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//landing page route
router.get("/", function(req, res){
   res.render('landing'); 
});
//main app landing page route
router.get("/home", (req, res) => {
   res.render('home'); 
});

//======================
// AUTHENTICATION ROUTES
//======================

//show register form
router.get("/register", function (req, res){
    res.render("register");
});

//handle sign up logic
router.post('/register', function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {"error": err.message});
        } 
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "Thank you for registering your information with my system. I am pleased to meet you, " + user.username + ", and should you need to contact me, I hope to have created enough of a platform to ensure a direct connection suitable to our level of acquaintance.");
            res.redirect("/dogs")
        });
   });
}); 


//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/dogs",
    failureRedirect: "/login"
    
}), function(req, res){
    
});

//logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/home");
});

module.exports = router;