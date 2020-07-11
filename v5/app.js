var express = require('express');
app = express();

//==========================================
//bodyparser route
//===========================================
var bodyparser = require('body-parser');
const { response } = require('express');
app.use(bodyparser.urlencoded({extended: true})); 
//==========================================
//database connections 
//===========================================
var mongoose = require("mongoose"); 
mongoose.connect("mongodb://localhost/yelp_camp",{ useUnifiedTopology: true ,useNewUrlParser: true }); // database connection 
//============================================
//comments route
//=============================================
var Campground = require("./models/campground");
var Comment = require("./models/comment");
//============================================
//user authentications
//============================================
var passport               = require("passport");
var localstrategy          = require("passport-local");
var passposrtlocalmongoose = require("passport-local-mongoose");
var User                   = require("./models/user")

app.use(require("express-session")({
    secret: "anand , you will be red coder in one year",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=================================================
var seedDB = require("./seed");
seedDB();

//==================================
app.use(function(req,res,next){
    res.locals.curuser = req.user;
    next();
});
//===================================

app.get("/",function(req,res){
    res.render("landing.ejs");
});

app.get("/campground",isLoggedIn,function(req,res){
    // var campgrounds = campground;
    // res.render("campground.ejs",{campground : campgrounds});
    Campground.find({},function(err,allcampground){
        if(err)
        console.log("something went wrong");
        else
        {
            res.render("campground/index.ejs",{campground : allcampground});
        }
    });
});

app.post("/campground",isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var newcampground = {name: name, image: image, description: desc};

    Campground.create(newcampground,function(err,abcd){
        if(err)
        console.log("something went wrong");
        else
        console.log(abcd);
    })

    res.redirect("/campground");
});

// ====================
// creating new form for adding 
// ====================
app.get("/campground/new",isLoggedIn,function(req,res){
    res.render("campground/new.ejs");
});

// ====================
// show routing 
// ====================
app.get("/campground/:id",isLoggedIn,function(req,res){
    Campground.findById(req.params.id).populate("comment").exec(function(err,founddata){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(founddata);
            res.render("campground/show.ejs",{data: founddata});
        }
    });
});

// ====================
// comment routing 
// ====================

app.get("/campground/:id/comment/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,data){
        if(err)
        console.log(err);
        else
        res.render("comment/new.ejs",{campground: data});
    });
});

app.post("/campground/:id/comment",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        console.log(err);
        else
        {
            var obj = {
                text: req.body.text,
                author: req.body.author,
            };

            console.log(obj);

            Comment.create(obj,function(err,comment){
                if(err)
                console.log(err);
                else
                {
                    campground.comment.push(comment);
                    campground.save();  
                        
                    res.redirect("/campground");
                }
            });
        }
    });
});

//==================================================
//authentications route  
//=================================================

//register====================================== 
app.get("/register",function(req,res){
    
    res.render("register.ejs");
});


app.post("/register",function(req,res){
    User.register(new User({username: req.body.username}), req.body.password , function(err, user){
        if(err)
        {
            console.log(err);
            res.redirect("/register");
        }

        passport.authenticate("local")(req,res,function(){
            res.redirect("/campground");
        });
    });
});

//==============================
//login
//==============================
app.get("/login",function(req,res){
    res.render("login.ejs");
});

app.post("/login",passport.authenticate("local",{
    successRedirect: "/campground",
    failureRedirect: "/login"
}),function(req,res){
});

//================================
//logout
//================================
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

//======================================
//check authentication middleware
//======================================
function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated()){
        return next();
    }
    else
    {console.log("error")
    res.redirect("/login");}
};


app.listen(3000,function(){
    console.log("server is ready to use anand bhai");
});