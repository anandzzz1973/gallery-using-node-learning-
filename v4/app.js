var express = require('express');

app = express();

var bodyparser = require('body-parser');
const { response } = require('express');
app.use(bodyparser.urlencoded({extended: true})); 

var mongoose = require("mongoose"); 

mongoose.connect("mongodb://localhost/yelp_camp",{ useUnifiedTopology: true ,useNewUrlParser: true }); // database connection 

var Campground = require("./models/campground");
var Comment = require("./models/comment");

var seedDB = require("./seed");
const campground = require('../v3/models/campground');
seedDB();

app.get("/",function(req,res){
    res.render("landing.ejs");
});

app.get("/campground",function(req,res){
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

app.post("/campground",function(req,res){
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
app.get("/campground/new",function(req,res){
    res.render("campground/new.ejs");
});

// ====================
// show routing 
// ====================
app.get("/campground/:id",function(req,res){
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

app.get("/campground/:id/comment/new",function(req,res){
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

app.listen(3000,function(){
    console.log("server is ready to use anand bhai");
});