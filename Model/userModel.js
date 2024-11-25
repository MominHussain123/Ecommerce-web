const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    randomToken: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user'], 
        default: 'user',         
    },
});


const users = new mongoose.model("UserModel", userSchema);

module.exports = {users};

