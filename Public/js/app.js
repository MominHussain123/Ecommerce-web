
const goToAddToCart = (id) => {
    window.location.href = `http://localhost:7000/addtocart.html?id=${id}`
}


function logout() {
    localStorage.removeItem('token')
    window.location.href = './signup.html'
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
document.getElementById("cart-count").addEventListener("click",()=>{
    window.location.href = "./cart.html"
})
getCart()   



const categoryDropdown = document.getElementById("category");

categoryDropdown.addEventListener("change", () => {
    const selectedCategory = categoryDropdown.value;
    dataget(selectedCategory)
});


const dataget = (category) => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:7000/getproduct?category=${category}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((resp) => {
            console.log(resp.data);
            document.getElementById("product-container").innerHTML = "";
            resp.data.data.map(function (data) {
                var productBox = `
                    <div class="product-box product-box1" tabindex="0" onclick="goToAddToCart('${data._id}')">
                        <img src="${data.productImage}" alt="">
                        <p>${data.productName}</p>
                        <p>$${data.productPrice}</p>
                    </div>
                `;
                document.getElementById("product-container").innerHTML += productBox;
            });
        })
        .catch((error) => {
            const status = error.response.status;
            if (error.response && (status === 401 || status === 403)) {
                window.location.href = "/login.html";
            } else {
                console.log(error);
            }
        });
};

// Initial call to fetch products
dataget();





