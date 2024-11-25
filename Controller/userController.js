const { users } = require("../Model/userModel.js");
const carts = require('../Model/cartModel.js');
const product = require("../Model/productModel.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring")
const bcrypt = require("bcrypt");
const saltround = 10;
require('dotenv').config();
const connectCloudinary = require("../Config/cloudinary.js")
const seckey = process.env.SECKEY;
const cloudinary = require("cloudinary").v2;
const Order = require('../Model/orderModel.js');

connectCloudinary()


const signup = async (req, resp) => {
    try {
        const { fullName, email, password } = req.body;

        const Existemail = await users.findOne({ email: email });

        const Existfname = await users.findOne({ fullName: fullName });

        if (Existemail) {
            return resp.send("This Email already exists");
        }
        if (Existfname) {
            return resp.send("This Fullname already exists");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return resp.status(404).send("Please enter a valid email address.");
        }
        const passwordlength = /^.{6,}$/
        const passwordLowercase = /^(?=.*[a-z])/;
        const passwordUppercase = /^(?=.*[A-Z])/;
        const passwordNumber = /^(?=.*\d)/;
        const passwordSpecialCharacters = /^(?=.*[\W_])/;
        if (!passwordlength.test(password)) {
            return resp.send("Password must be at least 6 characters");
        }
        else if (!passwordLowercase.test(password)) {
            return resp.send("Password must be contain lowercase");
        }
        else if (!passwordUppercase.test(password)) {
            return resp.send("Password must be contain uppercase");
        }
        else if (!passwordNumber.test(password)) {
            return resp.send("Password must be contain numbers");
        }
        else if (!passwordSpecialCharacters.test(password)) {
            return resp.send("Password must be contain  special characters.");
        }


        const salt = bcrypt.genSaltSync(saltround);
        const hash = bcrypt.hashSync(password, salt);


        // Create new user
        const data = new users({
            fullName: fullName,
            email: email,
            password: hash,
            randomToken: "",
        });

        // Save user data
        data.save();

        resp.status(201).send({
            message: "User registered successfully",
            data: data
        });
    } catch (error) {
        resp.send({
            status: 200,
            message: "An error occurred",
            error: error.message,
        });
    }
};
const login = async (req, resp) => {
    try {
        const { email, password } = req.body;
        const getdata = await users.findOne({ email: email });
        console.log(getdata);
        if (!getdata) {
            return resp.status(404).send("User not found");
        }
        const match = bcrypt.compareSync(password, getdata.password);
        if (!match) {
            return resp.status(404).send("Incorrect password");
        }
        jwt.sign({ userId: getdata._id }, seckey, { expiresIn: "60m" }, (err, token) => {
            if (err) return resp.send({ err: err })
            resp.send({
                status: 200,
                message: "Login successfully",
                data: getdata,
                token: token
            });
        })
    } catch (error) {
        resp.status(200).send({
            message: "An error occurred",
            error: error.message
        });
    }
};
const forgotpassword = async (req, resp) => {
    try {
        const { email } = req.body

        const getdata = await users.findOne({ email: email });
        if (getdata) {
            const randomString = randomstring.generate();

            const data = await users.updateOne(
                { email: email },
                { $set: { randomToken: randomString } }
            )
            sendEmail(getdata.fullName, getdata.email, randomString)
            resp.send({
                status: true,
                message: "Please check your email",
            })
        }
        else {
            return resp.send("Email not found");
        }
    } catch (error) {
        resp.send({
            status: 400,
            message: "Error occurred",
            error: error.message
        });
    }
}
const sendEmail = async (name, email, token) => {

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: "hafizmominhussain222@gmail.com",
                pass: process.env.TRANSPORT_PASSWORD,
            },
        });
        const mailOption = {
            from: "hafizmominhussain222@gmail.com",
            to: email,
            subject: "for reset password",
            html: `<p>hi ${name} ,please copy this link <a href='http://localhost:8000/resetpassword.html?token=${token}'>reset password</a> `
        }
        transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("mail has sent", info.response);
            }
        })
    }
    catch (error) {
        console.error("Error occurred: ", error);
    }
};
const resetpassword = async (req, resp) => {
    try {
        const token = req.query.token;
        const tokenData = await users.findOne({ randomToken: token });

        if (tokenData) {
            const password = req.body.password;
            const passwordlength = /^.{6,}$/
            const passwordLowercase = /^(?=.*[a-z])/;
            const passwordUppercase = /^(?=.*[A-Z])/;
            const passwordNumber = /^(?=.*\d)/;
            const passwordSpecialCharacters = /^(?=.*[\W_])/;
            if (!passwordlength.test(password)) {
                return resp.send("Password must be at least 6 characters");
            }
            else if (!passwordLowercase.test(password)) {
                return resp.send("Password must be contain lowercase");
            }
            else if (!passwordUppercase.test(password)) {
                return resp.send("Password must be contain uppercase");
            }
            else if (!passwordNumber.test(password)) {
                return resp.send("Password must be contain numbers");
            }
            else if (!passwordSpecialCharacters.test(password)) {
                return resp.send("Password must be contain  special characters.");
            }
            const salt = bcrypt.genSaltSync(saltround);
            const hash = bcrypt.hashSync(password, salt);

            const userdata = await users.findByIdAndUpdate(tokenData._id, { $set: { password: hash, randomToken: "" } }, { new: true });
            resp.send({
                status: 200,
                message: "Password updated successfully",
                success: true
            });
        } else {
            resp.send({
                status: 404,
                message: "Invalid token",
                success: false
            });
        }
    } catch (error) {
        resp.send({
            status: 500,
            message: "Error occurred",
            error: error.message
        });
    }
};
const addproduct = async (req, resp) => {
    try {

        const { productName, productPrice, categoryName } = req.body;

        const productImage = req.files.productImage[0].path;
        console.log(productImage);

        const upload = await cloudinary.uploader.upload(productImage);

        const data = new product({
            productImage: upload.secure_url,
            productName: productName,
            productPrice: productPrice,
            categoryName: categoryName

        })
        data.save();
        console.log(upload);
        resp.send({
            status: 200,
            message: "item add successfully",
            data: data
        });
    } catch (error) {
        resp.send({
            status: 200,
            message: "error occurred",
            error: error.message
        });
    }
}
const getProduct = async (req, resp) => {
    try {
        const categoryitems = await product.find({ categoryName: req.query.category });

        if (categoryitems.length) {
            return resp.status(200).send({
                status: 200,
                message: "Items retrieved successfully based on category",
                data: categoryitems,
            });
        }

        const allItems = await product.find();
        return resp.status(200).send({
            status: 200,
            message: "No category match, all items retrieved",
            data: allItems,
        });

    } catch (error) {
        resp.status(500).send({
            status: 500,
            message: "An error occurred",
            error: error.message,
        });
    }
};
const getOneProduct = async (req, resp) => {
    try {
        const getItem = await product.findOne({ _id: req.query.id })
        if (!getItem) return resp.send({ message: "data not found" });
        resp.send({
            status: 200,
            message: "Oneitem get successfully",
            data: getItem
        });

    } catch (error) {
        resp.send({
            status: 500,
            message: "error occurred",
            error: error.message
        });
    }
}
const deleteProduct = async (req, resp) => {
    try {
        const getdata = await product.findByIdAndDelete({ _id: req.params.id });

        if (!getdata) {
            return resp.send("data not found")
        }
        resp.send({
            status: 200,
            message: "product deleted  successfully",
            data: getdata
        });
    } catch (error) {
        resp.send({
            status: 500,
            message: "error occurred",
            error: error.message
        });
    }
}
const UpdateProduct = async (req, resp) => {
    try {
        // Extracting fields
        const { productName, productPrice, categoryName } = req.body;

        // Check if image is uploaded
        if (!req.files || !req.files.productImage || req.files.productImage.length === 0) {
            return resp.status(400).send({
                status: 400,
                message: "Product image is required",
            });
        }

        const productImage = req.files.productImage[0].path;
        console.log(productImage);

        // Upload image to Cloudinary
        const upload = await cloudinary.uploader.upload(productImage);

        // Update product in the database
        const updatedProduct = await product.findByIdAndUpdate(
            { _id: req.params.id },
            {
                productName,
                productPrice,
                categoryName,
                productImage: upload.secure_url
            },
            { new: true }
        );

        if (!updatedProduct) {
            return resp.status(404).send({
                status: 404,
                message: "Product not found",
            });
        }

        resp.status(200).send({
            status: 200,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        console.error("Error occurred:", error.message);
        resp.status(500).send({
            status: 500,
            message: "An error occurred",
            error: error.message,
        });
    }
};

const addtocart = async (req, resp) => {
    try {
        const userId = req.userId;
        const { productId } = req.body;

        const checkData = await carts.findOne({ userId: userId, productId: productId })

        if (checkData) {
            return resp.status(200).send(
                { message: "Cart is already added!" }
            )
        }
        const data = new carts({
            userId: userId,
            productId: productId,
        })
        await data.save()
        resp.send({
            status: 200,
            message: "add cart successfully",
            data: data
        });
    } catch (error) {
        resp.send({
            status: 500,
            message: "error occurred",
            error: error.message
        });
    }
}
const gettocart = async (req, resp) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return resp.status(400).send({ message: 'User ID is missing from request' });
        }
        const getdata = await carts.find({ userId: userId }).populate({
            path: "productId",
        });

        resp.send({
            status: 200,
            message: "get cart successfully",
            data: getdata
        });
    } catch (error) {
        resp.send({
            status: 500,
            message: "error occurred",
            error: error.message
        });
    }

}
const deleteCart = async (req, resp) => {
    try {
        const getdata = await carts.findByIdAndDelete({ _id: req.params.id });

        if (!getdata) {
            return resp.send("data not found")
        }
        resp.send({
            status: 200,
            message: "Cart deleted  successfully",
            data: getdata
        });
    } catch (error) {
        resp.send({
            status: 500,
            message: "error occurred",
            error: error.message
        });
    }
}


const addorder = async (req, resp) => {
    try {

        const userId = req.userId;


        const { firstName, lastName, email, phoneNumber, address1, address2, productId } = req.body;

        const checkData = await Order.findOne({ userId: userId, productId: productId })

        if (checkData) {
            return resp.status(200).send(
                { message: "This item already added!" }
            )
        }
        const data = new Order({
            userId: userId,
            productId: productId,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            address1: address1,
            address2: address2,
            productId: productId
        })
        await data.save();

        resp.send({
            status: 200,
            message: "order submit successfully",
            data: data
        });


    } catch (error) {
        console.error(error);
        resp.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
}
const getOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({ userId: userId }).populate([
            { path: "userId" },
            { path: "productId" }
        ])

        res.json({
            success: true,
            data: orders,
        });
    } catch (error) {   
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error:error
        });
    }
};
const updateOrders = async (req, resp) => {
    try {
        const { firstName, lastName, email, phoneNumber, address1, address2, status } = req.body;
        const getdata = await Order.findByIdAndUpdate({ _id: req.params.id }, { firstName, lastName, email, phoneNumber, address1, address2, status }, { new: true });

        if (!getdata) {
            return resp.send("data not found")
        }
        resp.send({
            status: 200,
            message: "order update  successfully",
            data: getdata
        });
    } catch (error) {
        resp.send({
            status: 500,
            message: "error occurred",
            error: error.message
        });
    };
}
const deleteOrders = async (req, resp) => {
    try {
        const getdata = await Order.findByIdAndDelete({ _id: req.params.id });

        if (!getdata) {
            return resp.send("data not found")
        }
        resp.send({
            status: 200,
            message: "order deleted  successfully",
            data: getdata
        });
    } catch (error) {
        resp.send({
            status: 500,
            message: "error occurred",
            error: error.message
        });
    };
}

const admin_user = async (req, resp) => {
    try {
        const usersdata = await users.find();

        resp.send({
            status: 200,
            message: "get data successfully",
            data: usersdata
        });
    } catch (error) {
        resp.status(500).send({ message: 'Error fetching users' });
    }
}
const adminuserDelete = async (req, resp) => {
    try {
        const getdata = await users.findByIdAndDelete({ _id: req.params.id });

        if (!getdata) {
            return resp.send("data not found")
        }
        resp.send({
            status: 200,
            message: "user deleted  successfully",
            data: getdata
        });
    } catch (error) {
        resp.send({
            status: 500,
            message: "error occurred",
            error: error.message
        });
    }
}
const adminUserUpdate = async (req, resp) => {
    try {

        const { fullName, email, role } = req.body;



        const getdata = await users.findByIdAndUpdate({ _id: req.params.id }, { fullName, email, role });

        if (!getdata) {
            return resp.send("data not found")
        }
        resp.send({
            status: 200,
            message: "User updated  successfully",
            data: getdata
        });
    } catch (error) {
        resp.send({
            status: 500,
            message: "error occurred",
            error: error.message
        });
    }
}



module.exports = {
    addproduct,
    getProduct,
    getOneProduct,
    forgotpassword,
    resetpassword,
    login,
    signup,
    addtocart,
    gettocart,
    deleteCart,
    deleteProduct,
    UpdateProduct,
    getOrders,
    admin_user,
    adminuserDelete,
    adminUserUpdate,
    addorder,
    deleteOrders,
    updateOrders,
}


