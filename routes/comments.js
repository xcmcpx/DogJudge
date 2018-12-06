var express = require("express");
var router = express.Router({mergeParams: true});
var Dog = require("../models/dog");
var Comment = require("../models/comment");
var middleware = require("../middleware");

/* ==========================
    COMMENT ROUTES
    ========================= */
    
//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find dog by id
    Dog.findById(req.params.id, function(err, dog){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {dog: dog});
        }
    });
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup dog using ID
   Dog.findById(req.params.id, function(err, dog){
      if(err){
          console.log(err);
          res.redirect("/dogs");
      } 
      //create new comment
   //connect new comment to dog
   //redirect back to show page of dog
      else{
          Comment.create(req.body.comment, function(err, comment){
             if(err){
                 req.flash("error", "Something went wrong. DB Screwed data screwed no clue just screwed.");
                 console.log(err);
             } else{
                 //add username and id to comment
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 //save comment
                 comment.save();
                 dog.comments.push(comment);
                 dog.save();
                 console.log(comment);
                 req.flash("success", "You did it! You posted your opinion online and I have record of it!");
                 res.redirect("/dogs/" + dog._id);
             }
          });
      }
   });
});
//edit comment route
router.get("/:comment_id/edit", middleware.checkCommentOwner, (req, res) => {
    Dog.findById(req.params.id, (err, foundDog) => {
           if(err || !foundDog){
               req.flash("error", "CAN'T FIND THAT HOMIE.");
               return res.redirect("back");
           }
           Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                res.redirect("back");
            } else{
                res.render("comments/edit", {dog_id: req.params.id, comment: foundComment}); 
            }
        });
    });
});

//update route
router.put("/:comment_id", middleware.checkCommentOwner, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/dogs/" + req.params.id);
        }
    });
});

//delete route
router.delete("/:comment_id", middleware.checkCommentOwner, (req, res) =>{
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
       if(err){
           req.flash("error", "Something went wrong. Your guess is as good as mine.");
           res.redirect("back");
       } else {
           req.flash("success", "You deleted your online opinion, and I now do not have record of it. Cheers.");
           res.redirect("/dogs/" + req.params.id);
       }
    });
});


module.exports = router;