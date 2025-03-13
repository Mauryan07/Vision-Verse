const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
const passportLocalMongoose=require('passport-local-mongoose');


const UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    email: {type: String, lowercase: true,  match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    bio: String,
    image: String
    
  }, {timestamps: true});

  UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});
  UserSchema.plugin(passportLocalMongoose);
  
const User = mongoose.model("User", UserSchema);

module.exports = User;