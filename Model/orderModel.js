const mongoose = require('mongoose');

// Define the Order schema
const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
    },
    status: {
        type: String,
        default: 'Pending'
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    address1: {
        type: String,
    },
    address2: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    address1: {
        type: String,
    },
    address2: {
        type: String,
    }
});


const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
