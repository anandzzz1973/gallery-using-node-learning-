var express = require('express');

app = express();

var bodyparser = require('body-parser');
const { response } = require('express');
app.use(bodyparser.urlencoded({extended: true})); 

var campground = [
    {name: "anand", image: "https://i.pinimg.com/236x/9e/69/d4/9e69d492948b425c63cd4e04aa6040a0.jpg"},
    {name: "aditya", image: "https://i.pinimg.com/564x/d6/bf/6d/d6bf6d035dbb7f2f7708611176be4edf.jpg"},
    {name: "himanshu", image: "https://i.pinimg.com/564x/1d/18/b4/1d18b40d015461f65343ba49a2b63cee.jpg"},
    {name: "rahul", image: "https://i.pinimg.com/564x/c7/30/f5/c730f55012aef069bce4005b7691e712.jpg"},
    {name: "madhukesh", image: "https://i.pinimg.com/564x/de/b7/b3/deb7b3275fe44de85bf1c650c47b63df.jpg"},
    {name: "pratul", image: "https://i.pinimg.com/564x/30/2b/f2/302bf2784ba0ec46cafc9bf34cc34f7a.jpg"},
];

app.get("/",function(req,res){
    res.render("landing.ejs");
});

app.get("/campground",function(req,res){
    var campgrounds = campground;
    res.render("campground.ejs",{campground : campgrounds});
});

app.post("/campground",function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    
    var newcampground = {name: name, image: image};

    campground.push(newcampground);

    console.log(name);
    console.log(image);

    res.redirect("/campground");
});

app.get("/campground/new",function(req,res){
    res.render("new.ejs");
});

app.listen(3000,function(){
    console.log("server is ready to use anand bhai");
});