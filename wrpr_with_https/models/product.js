const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
const passportLocalMongoose=require('passport-local-mongoose');


const ProductSchema = new mongoose.Schema({
    name: {type:String,required: [true, "can't be blank"] },
    info: String,
    price: String,
    model:String,
    external_link: String,
    password:String,
    image: {
      type:String
    },
    ratings:[
      {
        star:Number,
        review:String,
        postedby:{type: mongoose.Types.ObjectId, ref: "User"},
        reviewer:String
      }
    ],
    totalratings:{
      type:String,
      default:0
    },
    user_id:{type: mongoose.Types.ObjectId, ref: "User"}
  }, {timestamps: true});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;