var express = require('express');

app = express();

var bodyparser = require('body-parser');
const { response } = require('express');
app.use(bodyparser.urlencoded({extended: true})); 

var mongoose = require("mongoose"); 

mongoose.connect("mongodb://localhost/yelp_camp",{ useUnifiedTopology: true ,useNewUrlParser: true }); // database connection 

var Campground = require("./models/campground");

var seedDB = require("./seed");
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
            res.render("campground.ejs",{campground : allcampground});
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

app.get("/campground/new",function(req,res){
    res.render("new.ejs");
});

//show more info page 
app.get("/campground/:id",function(req,res){
    Campground.findById(req.params.id).populate("comment").exec(function(err,founddata){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("show.ejs",{data: founddata});
        }
    });
});

app.listen(3000,function(){
    console.log("server is ready to use anand bhai");
});