var mongoose = require("mongoose");
var passposrtlocalmongoose = require("passport-local-mongoose");

var userschema = new mongoose.Schema({
    username: String,
    password: String
});

userschema.plugin(passposrtlocalmongoose);

module.exports = mongoose.model("User",userschema);