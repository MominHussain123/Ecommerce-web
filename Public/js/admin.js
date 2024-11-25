
const checkToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "/login.html";
    }
};
checkToken()

const addProduct = () => {
    const productName = document.querySelector("#productName").value;
    const productPrice = document.querySelector("#productPrics").value;
    const categoryName = document.querySelector("#categoryName").value;
    const productImage = document.querySelector("#productImg").files[0];

    if (productName === "" && productPrice === "") {
        return alert("Fill your form")
    } else {
        const formData = new FormData();
        formData.append("productImage", productImage);
        formData.append("productPrice", productPrice);
        formData.append("productName", productName);
        formData.append("categoryName", categoryName);
        const token = localStorage.getItem('token');
        axios.post("http://localhost:7000/addproduct", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${token}`
            },
        }).then((resp) => {
            alert(resp.data.message);
            console.log(resp.data);
            console.log(resp.data.message);
            console.log(resp.data.data.length);
            dataget();
        }).catch((error) => {
            const status = error.response.status;
            if (error.response && (status === 401 || status === 403)) {
                window.location.href = "/login.html";
            } else {
                console.log(error);
            }
        })
    }
}
let category = false;
const dataget = () => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:7000/getproduct?category=${category}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((resp) => {
            console.log(resp.data);

            const adminContainer = document.getElementById("admin-container");
            adminContainer.innerHTML = "";

            resp.data.data.forEach(function (data) {
                var productBox = `
                <div class="admin-box" id="${data._id}">
                <div class="box">
                <img src="${data.productImage}" alt="">
                </div>
                <div class="box">
                <h1>Name</h1>
                <p>${data.productName}</p>
                </div>
                <div class="box">
                <h1>Price</h1>
                <p>$${data.productPrice}</p>
                </div>
                <div class="box">
                <h1>category</h1>
                <p>${data.categoryName}</p>
                </div>
                <div class="box">                
                    <button class="btn" onclick="deleteProduct('${data._id}')">Delete</button>
                    <button class="btn" onclick="getEmailInInput('${data._id}','${data.productPrice}','${data.productName}','${data.categoryName}')">edit</button>
                </div>
                </div>
            `;
                adminContainer.innerHTML += productBox;
            });
        })
        .catch((error) => {
            console.log(error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                console.log("Unauthorized access, redirecting to login...");
                window.location.href = "/login.html";
            }
        });
}
dataget();
const getEmailInInput = (id, price, name, category) => {
    console.log(id);
    console.log(category);
    formContainer.classList.remove("close");
    adminContainer.classList.remove("open");
    document.getElementById("form-container").innerHTML = `
    <div class="admin-form">
        <input type="file" id="productImg1"><br>
        <input type="text" value="${price}" placeholder="product price" id="productPrics1"><br>
        <input type="text" value=${name} placeholder="product name" id="productName1"><br>
        <input type="text"  value=${category}  placeholder="category name" id="categoryName1"><br>
        <input type="submit" id="addItem" value="Add Item" onclick="updateProduct('${id}')">
    </div>
    `
}
const updateProduct = (id) => {
    const productName = document.querySelector("#productName1").value;
    const productPrice = document.querySelector("#productPrics1").value;
    const categoryName = document.querySelector("#categoryName1").value;
    const productImage = document.querySelector("#productImg1").files[0];
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append("productImage", productImage);
    formData.append("productPrice", productPrice);
    formData.append("productName", productName);
    formData.append("categoryName", categoryName);
    axios.put('http://localhost:7000/UpdateProduct/' + id, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        }
    }).then((res) => {
        console.log(res.data);
        console.log(res.data.message);  
        alert(res.data.message);
        dataget()
        formContainer.classList.add("close");
        adminContainer.classList.add("open");
    }).catch((err) => {
        console.log(err);
    })
}
const deleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:7000/deleteProduct/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((resp) => {
            console.log(resp.data);
            alert(resp.data.message);
            dataget()
        })
        .catch((error) => {
            const status = error.response.status;
            if (error.response && (status === 401 || status === 403)) {
                window.location.href = "/login.html";
            } else {
                console.log(error);
            }
        })
}
const adminform = document.querySelector(".admin-form");
const adminbox = document.querySelectorAll(".admin-box");


const formContainer = document.getElementById("form-container");
const adminContainer = document.getElementById("admin-container");
const orderContainer = document.getElementById("order-container");
const userContainer = document.getElementById("User-container");
function AddItem() {
    formContainer.classList.remove("close");
    adminContainer.classList.remove("open");
    orderContainer.classList.remove("openbox");
    userContainer.classList.remove("open")
}
function ListItem() {
    adminContainer.classList.add("open")
    formContainer.classList.add("close");
    orderContainer.classList.remove("openbox");
    userContainer.classList.remove("open")
}
function Order() {
    formContainer.classList.add("close");
    adminContainer.classList.remove("open");
    orderContainer.classList.add("openbox");
    userContainer.classList.remove("open")
}
function Users() {
    userContainer.classList.add("open")
    formContainer.classList.add("close");
    adminContainer.classList.remove("open");
    orderContainer.classList.remove("openbox");
}



const getorder = () => {
    const token = localStorage.getItem('token');

    axios
        .get('http://localhost:7000/getorder', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((resp) => {
            console.log(resp.data);

            const orderContainer = document.getElementById('order-container');
            orderContainer.innerHTML = ''; // Clear existing orders

            let totalPrice = 0; // Reset total price
            resp.data.data.forEach((item) => {
                const user = item.userId.fullName;
                const email = item.userId.email;
                const price = item.productId.productPrice;
                const id = item._id;
                const productName = item.productId.productName;

                // totalPrice += Math.floor(price);

                const cartProduct = `
                <div class="order-box">
                    <div class="box">
                        <p><strong>User:</strong> ${user}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Order ID:</strong> ${id}</p>
                    </div>
                    <div class="name">
                        <h4 class="product-name">${productName}</h4>
                    </div>
                    <div class="name">
                        <h4 class="product-price">$${price}</h4>
                    </div>

                    <div class="form-group">
                        <label for="status-${id}">Status:</label>
                        <select id="status-${id}" class="status-dropdown" name="status" data-order-id="${id}">
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                `;
                // Append to the order container
                orderContainer.innerHTML += cartProduct;
            });

            // <div class="total">
            //     <h4>Total Price: $${totalPrice}</h4>
            // </div>

            // Show total price once
            // Add event listener to all dropdowns
            document.querySelectorAll('.status-dropdown').forEach((dropdown) => {
                dropdown.addEventListener('change', (event) => {
                    const selectedStatus = event.target.value;
                    const orderId = event.target.dataset.orderId; // Get order ID from data attribute
                    updateOrderStatus(selectedStatus, orderId);
                });
            });
        })
        .catch((error) => {
            console.error(error);
        });
};


getorder();

const updateOrderStatus = (status, id) => {
    console.log('Updating order status:',  status, id )
    const token = localStorage.getItem('token');
    axios
        .put(
            `http://localhost:7000/updateOrders/${id}`,
            { status: status },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then((response) => {
            console.log('Order status updated:', response.data);
        })
        .catch((error) => {
            console.error('Error updating order status:', error);
        });
};




const loadUsers = () => {

    const token = localStorage.getItem('token');
    axios.get("http://localhost:7000/getadminusers", {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    }).then((resp) => {

        console.log(resp.data);


        const tableBody = document.querySelector('#userTable tbody');
        tableBody.innerHTML = '';

        resp.data.data.forEach((user) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${user._id}</td>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
            <button class="btn btn-edit" onclick="editUser('${user._id}','${user.email}','${user.fullName}','${user.role}')">Edit</button>
            <button class="btn btn-delete" onclick="deleteUser('${user._id}')">Delete</button>
        </td>
        `;
            tableBody.appendChild(row);
        });
    }).catch((error) => {
        console.error('Error loading users:', error);
    })

};
// Load Users on Page Load
loadUsers()

const deleteUser = (id) => {
    console.log(id);
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:7000/deleteadminusers/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    }).then((resp) => {
        console.log(resp.data);
        alert(resp.data.message);
        loadUsers()

    }).catch(() => {
        console.error('Error deleting user:', error);
    })
}

const editUser = (id, email, name, role) => {
    console.log(id);
    formContainer.classList.remove("close");
    adminContainer.classList.remove("open");
    orderContainer.classList.remove("openbox");
    userContainer.classList.remove("open")

    document.getElementById("form-container").innerHTML = `
    <div class="admin-form">
        <input type="text" value=${role} placeholder="product role" id="role"><br>
        <input type="text" value="${email}" placeholder="product price" id="email"><br>
        <input type="text" value=${name} placeholder="product name" id="name"><br>
        <input type="submit" id="addItem" value="Add Item" onclick="updateUser('${id}')">
    </div>
    `
}

const updateUser = (id) => {
    const role = document.querySelector("#role").value;
    const email = document.querySelector("#email").value;
    const fullname = document.querySelector("#name").value;
    const token = localStorage.getItem('token');

    axios.put('http://localhost:7000/Updateadminusers/' + id, {
        fullName: fullname,
        email: email,
        role: role
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        console.log(res.data);
        alert(res.data.message);
        loadUsers
        formContainer.classList.add("close");
        userContainer.classList.add("open");
    }).catch((err) => {
        console.log(err);
    })
}

