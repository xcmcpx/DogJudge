var express = require("express");
var router = express.Router();
var Dog = require("../models/dog");
var Comment = require("../models/comment");
var middleware = require("../middleware");

/* DOG JUDGE ROUTES */

//route that will contain our dogs for judgement
router.get("/", function(req, res){
        //get all dogs from DB
        Dog.find({}, function(err, allDogs){
           if(err){
               console.log(err);
           } else{
               res.render("dogs/index", {dogs: allDogs});
           }
        });
        
});

//create route
router.post("/", middleware.isLoggedIn, function(req, res){
   //get data from form and add to dogs array
   var name =req.body.name;
   var breed =req.body.breed;
   var image = req.body.image;
   var desc = req.body.desc;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newDog = {name: name, breed: breed, image: image, desc: desc, author:author};
   //create new dog and save to DB
   Dog.create(newDog, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
           res.redirect("/dogs");
       }
   });
});

//route for form to create new dog
router.get('/new', middleware.isLoggedIn, function(req, res){
   res.render('dogs/new') 
});

//SHOW ROUTE
//make sure this is defined AFTER any other /dogs/X routes so that they are not caught in the :id automation
router.get("/:id", function(req, res){
    //find the dog with provided ID
    Dog.findById(req.params.id).populate("comments").exec(function(err, foundDog){
       if(err || !foundDog){
           req.flash("error", "Couldn't find that one, yikers.");
           res.redirect("back");
       } else{
           console.log(foundDog)
           res.render("dogs/show", {dog: foundDog});
       }
    });
});

//EDIT DOG ROUTE
router.get("/:id/edit", middleware.checkDogOwner, function(req, res){
    Dog.findById(req.params.id, function(err, foundDog){
        if(err){
            req.flash("error", "Looks like a search for something that doesn't exist. NO DB RECORD!");
            res.redirect("back");
        }
        res.render("dogs/edit", {dog: foundDog});
    });
});
//UPDATE DOG ROUTE
router.put("/:id",middleware.checkDogOwner, function(req, res){
   //find and update the correct dog
   Dog.findByIdAndUpdate(req.params.id, req.body.dog, function(err, updatedDog){
       if(err){
           res.redirect("/dogs");
       } else {
           res.redirect("/dogs/" + req.params.id);
       }
   } );
   //redirect to show page
   
});

//DESTROY DOG ROUTE
router.delete("/:id", middleware.checkDogOwner, (req, res) => {
    Dog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/dogs");
        }else{
            res.redirect("/dogs");
        }
    });
});



module.exports = router;