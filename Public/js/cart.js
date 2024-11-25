
const getCart = async () => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:7000/gettocart`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((resp) => {
            const product = resp.data.data;
            console.log(product);

            document.getElementById("count").innerHTML = product.length;
            let totalPrice = 0;
            product.forEach((item) => {
                totalPrice += Math.ceil(item.productId.productPrice)
            }); 
            document.querySelector("#total-price").innerHTML = `Total Price: $${totalPrice}`;
            
            
            document.getElementById("count").innerHTML = product.length

            document.querySelector("#cart-container").innerHTML = "";
            product.map((item) => {
                const productName = item.productId.productName;
                const price = item.productId.productPrice;
                const productImage = item.productId.productImage
                const id = item._id


                var cartproduct = `
                            <div class="product-box">
                                <div class="image">
                                <img src="${productImage}" alt="">
                                </div>
                                <div class="name">
                                <h1 id="product-name">Name:${productName}</h1>
                                </div>
                                    <div class="name">
                                        <h3 class="product-price" >Price : $${price}</h3>
                                    </div>
                                    <div class="buttons">
                                        <button class="btn" onclick="deletCart('${id}')">Delete Cart</button>
                                    </div>
                            </div>
                            `
                document.querySelector("#cart-container").innerHTML += cartproduct;
            })

            
            
        }).catch((error) => {
            console.log(error);
        })
}

getCart()

// document.querySelector("#total-price").innerHTML = total_price;

const deletCart = async (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:7000/deleteCart/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((resp) => {
            console.log(resp.data);
            alert(resp.data.message);
            getCart();
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

// const gettoCart = async () => {
//     const token = localStorage.getItem('token');
//     axios.get(`http://localhost:7000/gettocart`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//         .then((resp) => {
//             const product = resp.data.data;
//             document.getElementById("count").innerHTML = product.length
//         }).catch((error) => {
//             const status = error.response.status;
//             if (error.response && (status === 401 || status === 403)) {
//                 window.location.href = "/login.html";
//             }
//             else {
//                 console.log(error);
//             }
//         })
// }
document.getElementById("cart-count").addEventListener("click", () => {
    window.location.href = "./cart.html"
})
// gettoCart()


function logout() {
    localStorage.removeItem('token')
    window.location.href = './signup.html'
}

