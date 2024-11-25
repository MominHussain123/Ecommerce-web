
const getCart = async () => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:7000/gettocart`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((resp) => {
            const product = resp.data.data;
            document.getElementById("count").innerHTML = product.length
        }).catch((error) => {
            const status = error.response.status;
            if (error.response && (status === 401 || status === 403)) {
                window.location.href = "/login.html";
            }
            else {
                console.log(error);
            }
        })
}
getCart()


function logout() {
    localStorage.removeItem('token')
    window.location.href = './signup.html'
}


const OrderSubmit = async () => {

    const getId = () => {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("productId")
        return productId
    }

    const productId = getId();

    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const email = document.getElementById("email");
    const phonenumber = document.getElementById("phonenumber");
    const address1 = document.getElementById("address1");
    const address2 = document.getElementById("address2");
    if (firstname.value === "" && lastname.value === "" && email.value === "" && phonenumber.value === "" && address1.value === "" && address2.value === "") {
        alert("Please fill all the fields");
    } else {
        const token = localStorage.getItem('token');
        await axios.post("http://localhost:7000/addorder", {
            firstName: firstname.value, 
            lastName: lastname.value,
            email: email.value,
            phoneNumber: phonenumber.value,
            address1: address1.value,
            address2: address2.value,
            productId: productId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }).then((resp) => {
            console.log(resp.data);
            alert(resp.data.message);
            window.location.href = "./myorder.html";
        }).catch((error) => {
            console.error('Error loading users:', error);
        })
    }
}




// const track = () => {
//     document.querySelector(".order-tracking").style.display = "none";
//     document.querySelector(".form-container").style.display = "flex";
// }

// const Next = () => {
//     document.querySelector(".order-tracking").style.display = "flex";
//     document.querySelector(".form-container").style.display = "none";
// }

// const orderdelete = () => {
//     const token = localStorage.getItem('token')
//     const productId = getId()
//     axios.delete(`http://localhost:7000/deleteOrders/${productId}`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         },
//     })
//         .then((resp) => {
//             console.log(resp.data);
//             alert(resp.data.message
//             )
//         })
//         .catch((error) => {
//             console.error('Error loading users:', error);
//         })
// }

