const mongoose = require("mongoose");
require("dotenv").config();

const dbUrl = process.env.MONGODB_URL;
const connectDB = () => {

    mongoose.connect(dbUrl).then(() => {
        console.log("Mongodb Connected");
    })
        .catch((err) => {
            console.log("Mongodb Not Connected!", err);
        });

}

module.exports = connectDB