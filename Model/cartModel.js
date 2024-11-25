
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "UserModel"
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "product"
    }
});

const carts = new mongoose.model("Cart", cartSchema);

module.exports = carts; 