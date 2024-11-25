const express = require("express"); 
const connectDB = require("./Config/connectdb")
const app = express();
const path = require("path");
const user_routes = require("./Router/router.js")
const bodyparser = require("body-parser");
const cors = require("cors");
app.use(express.static(path.resolve(path.join(__dirname,"Public"))));
app.use(express.json());
app.use(bodyparser.json());

app.use(cors({
    origin: "*",
    withCredentials: true,
}));

app.use(user_routes);


connectDB();


const port = process.env.PORT;
app.listen(port,()=>{
    console.log("server is running on port "+port);
});

