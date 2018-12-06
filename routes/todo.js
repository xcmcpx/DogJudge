var express = require("express");
var router = express.Router();
var Todo = require("../models/todo");
var middleware = require("../middleware");
var User = require("../models/user");


/* =======================
to do list routes
=========================*/

router.get("/", (req, res) => {
    Todo.find({}, (err, allTodos) => {
        if(err){
            console.log(err);
        }else{
            res.render( 'todo/index', {todos: allTodos});    
        }
    });
});


//create route
router.post("/", function(req, res){
   //get data from form and add to dogs array
   var title =req.body.title;
   var desc = req.body.desc;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newTodo = {title: title, desc: desc, author: author};
   //create new dog and save to DB
   Todo.create(newTodo, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
           console.log(newTodo);
           res.redirect("/todo");
       }
   });
});

router.get('/new', middleware.isLoggedIn, function(req, res){
   res.render('todo/new') 
});

//SHOW ROUTE
router.get("/:id", middleware.isLoggedIn, function(req, res){
    //find the to do with provided ID
    User.findById(req.user).populate("todoList").exec(function(err, foundTodo){
       if(err || !foundTodo){
           console.log(req.user);
           req.flash("error", "Couldn't find that one, yikers.");
           res.redirect("back");
       } else{
           console.log(foundTodo)
           res.render("todo/show", {todos: foundTodo});
       }
    });
});

// EDIT ROUTE
router.get("/:id/edit", function(req, res){
    Todo.findById(req.params.id, function(err, foundTodo){
        if(err){
            req.flash("error", "Looks like a search for something that doesn't exist. NO DB RECORD!");
            res.redirect("back");
        }
        res.render("todo/edit", {todo: foundTodo});
    });
});

//UPDATE ROUTE
router.put("/:id", function(req, res){
   //find and update the correct dog
   Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, updatedTodo){
       if(err){
           res.redirect("/todo");
       } else {
           res.redirect("/todo/" + req.params.id);
       }
   } );
   //redirect to show page
   
});

//DESTROY DOG ROUTE
router.delete("/:id", (req, res) => {
    Todo.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/todo");
        }else{
            res.redirect("/todo");
        }
    });
});

module.exports = router;