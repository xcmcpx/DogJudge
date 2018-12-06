var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");


/*BLOG ROUTES */
router.get('/blogs', isLoggedIn, function(req, res){
    Blog.find({}, function(err, blogs){
       if(err){
           console.log('Error!');
       } else {
           res.render("blogindex", {blogs: blogs});
       }
    });
});

//new route
router.get('/blogs/new', isLoggedIn, function(req, res){
    res.render('newblog');
});

//create route
router.post("/blogs", isLoggedIn, function(req, res){
   //create blog 
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("newblog");
           //then run redirect
       }else {
           res.redirect('/blogs');
       }
   });
});

//show route
router.get("/blogs/:id", isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogindex");
        }else{
            res.render("showblog", {blog: foundBlog});
        }
    });
});
//edit route
router.get("/blogs/:id/edit", isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("editblog", {blog: foundBlog});
        }
    });
});

//update route
router.put("/blogs/:id", isLoggedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           res.redirect('/blogs');
       } else{
           res.redirect("/blogs/" + req.params.id);
       }
    });
});

//DESTROY ROOUTE
router.delete("/blogs/:id", isLoggedIn, function(req, res){
    //destory blog
    Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } 
       else{
           res.redirect("/blogs");
       }
    });
    //redirect somewhere
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;