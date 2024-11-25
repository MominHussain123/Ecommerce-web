const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productImage: String,
    productName:String,
    productPrice:String,
    categoryName:String 
});

const product = new mongoose.model("product", productSchema)

module.exports = product