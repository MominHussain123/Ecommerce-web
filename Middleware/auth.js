
const jwt = require("jsonwebtoken");
const seckey = process.env.SECKEY;

const authToken = async (req, resp, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return resp.status(401).send("Auth not defined");

        const token = authHeader.split(" ")[1];

        if (!token) return resp.status(403).send("Access denied");

        jwt.verify(token, seckey, (err, user) => {
            if (err) return resp.status(403).send({ err: err });
            console.log(user);
            req.userId = user.userId;
            next();
        });
    }
    catch (error) {
        resp.status(500).send({ message: error.message });
    }
};

module.exports = authToken;

