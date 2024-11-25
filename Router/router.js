const user_routes = require("express").Router();
const auth = require("../Middleware/auth.js");
const upload = require("../Config/multer.js");
const route = require("../Controller/userController.js");

user_routes.post("/signup", route.signup);
user_routes.post("/login", route.login);
user_routes.post("/forgotpassword", route.forgotpassword);
user_routes.post("/resetpassword", route.resetpassword);


user_routes.post("/addproduct", auth, upload.fields([{ name: 'productImage', maxCount: 1 }]), route.addproduct);
user_routes.get("/getproduct", auth, route.getProduct);
user_routes.delete("/deleteProduct/:id", auth, route.deleteProduct);
user_routes.put("/UpdateProduct/:id", auth, upload.fields([{ name: 'productImage', maxCount: 1 }]), route.UpdateProduct);

user_routes.get("/getOneProduct", auth, route.getOneProduct);
user_routes.post("/addtocart", auth, route.addtocart);
user_routes.get("/gettocart", auth, route.gettocart);
user_routes.delete("/deleteCart/:id", auth, route.deleteCart);


user_routes.get("/getadminusers", auth, route.admin_user);
user_routes.delete("/deleteadminusers/:id", auth, route.adminuserDelete);
user_routes.put("/Updateadminusers/:id", auth, route.adminUserUpdate);

user_routes.post("/addorder", auth, route.addorder);
user_routes.get("/getorder", auth, route.getOrders);
user_routes.delete("/deleteOrders/:id", auth, route.deleteOrders);
user_routes.put("/updateOrders/:id", auth, route.updateOrders);

module.exports = user_routes;


// user_routes.post("/addorder", auth, route.addOrders);

                            