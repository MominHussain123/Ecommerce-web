let submit = document.querySelector(".submit");

submit.addEventListener("click", () => {
    let email = document.querySelector(".email").value;
    if (email === "") {
        alert("fill your input")
    } else {
        axios.post('http://localhost:7000/forgotpassword', {
            email: email,
        })
            .then(function (res) {
                alert(res.data.message);
                console.log(res.data)
            })
            .catch(function (error) {
                console.log(error);
            })
    }
})

