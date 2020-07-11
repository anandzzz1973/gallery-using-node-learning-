var mongoose = require("mongoose");
var campgroundschema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundschema);