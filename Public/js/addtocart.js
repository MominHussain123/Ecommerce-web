
const getOneItems = async () => {

    const getId = () => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id")
        return id
    }

    const id = getId();
    if (!id) {
        alert("id not found")
    } else {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:7000/getOneProduct/?id=${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resp) => {
                document.querySelector("#addtocart-container").innerHTML = "";
                const product = resp.data.data
                var clickproduct = `
                            <div class="product-box">
                                <div class="image">
                                    <img src="${product.productImage}" alt="">
                                </div>
                                <div class="name">
                                    <h1 id="product-name"> Name <br> ${product.productName}</h1>
                                    <h3 class="product-price" >Price <br>$ ${product.productPrice}</h3>
                                </div>
                                <div class="buttons">
                                    <button class="btn" onclick="gotoaddOrder('${product._id}')">Buy Now</button>
                                    <button class="btn" onclick="addtoCart('${product._id}')">Add to cart</button>
                                </div>
                            </div>
                            
                            `
                document.querySelector("#addtocart-container").innerHTML = clickproduct;
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
getOneItems()


const addtoCart = (productId) => {
    const token = localStorage.getItem('token');
    console.log(token);
    axios.post(`http://localhost:7000/addtocart`,
        { productId: productId },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    )
        .then((resp) => {
            alert(resp.data.message);
        }).catch((error) => {
            console.log(error);
        })
}

const addOrder = (productId) => {
    const token = localStorage.getItem('token');
    axios.post(`http://localhost:7000/addorder/?productId=${productId}`,
        { productId: productId },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    )
        .then((resp) => {
            alert(resp.data.message);
            console.log(resp.data);
        }).catch((error) => {
            console.log(error);
        })
}

const gotoaddOrder = (productId)=>{
    window.location.href = `http://localhost:7000/order.html?productId=${productId}`
}




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
document.getElementById("cart-count").addEventListener("click", () => {
    window.location.href = "./cart.html"
})

getCart()



function logout() {
    localStorage.removeItem('token')
    window.location.href = './signup.html'
}

