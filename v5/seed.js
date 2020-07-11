var mongoose = require("mongoose");

var Campground = require("./models/campground");

var Comment = require("./models/comment")

var data = [
    {
        name: "hilly",
        image: "https://i.pinimg.com/564x/78/08/28/78082851c3fd6e0f394305d4eb0c1659.jpg",
        description: "this is wonderful places"
    },
    {
        name: "jharna",
        image: "https://i.pinimg.com/564x/a3/3f/86/a33f86fcd8edba60c037318f43346c6d.jpg",
        description: "this is wonderful places"
    },
    {
        name: "birbs",
        image: "https://i.pinimg.com/564x/e5/e4/6f/e5e46fb95c9676d5dfdbdb62ba580f97.jpg",
        description: "this is wonderful picture "
    }
]

function seedDB()
{
    Campground.deleteMany({}, function(err){
        if(err)
        console.log(err);
        else
        console.log("removed");


    data.forEach(function(seed){
        Campground.create(seed,function(err,data){
            if(err)
            console.log(err);
            else
            {
                Comment.create(
                    {
                        text: "blah blah blah",
                        author: "blah blah blah blah"
                    },
                    function(err,comment)
                    {
                        if(err)
                        console.log(err);
                        else
                        {
                            data.comment.push(comment);
                            data.save();
                            console.log("comment has been added");
                        }
                        
                    }
                )
            }
        });
    });
});
}

module.exports = seedDB;
