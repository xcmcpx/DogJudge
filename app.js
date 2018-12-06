var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    Dog = require("./models/dog"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Blog = require("./models/blog"),
    Todo = require("./models/todo"),
    flash = require("connect-flash");
    
var commentRoutes = require("./routes/comments"),
    dogRoutes = require("./routes/dogs"),
    blogRoutes = require("./routes/blogs"),
    authRoutes = require("./routes/index"),
    todoRoutes = require("./routes/todo");


var url = process.env.DATABASEURL || "mongodb://localhost:27017/dogExampleDatabase_v12deployed";
//APP config
require("dotenv").config();
mongoose.connect(url, {useNewUrlParser: true});



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());

//seed the database
//seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "The blackbird sleeps at dawn",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use("/todo", todoRoutes);
app.use(authRoutes);
app.use("/dogs", dogRoutes);
app.use("/dogs/:id/comments", commentRoutes);
app.use(blogRoutes);

//app.listen so our app starts on a port
app.listen(process.env.PORT, process.env.IP, function(){
   console.log('TEST PP SERVER HAS STARTED'); 
});