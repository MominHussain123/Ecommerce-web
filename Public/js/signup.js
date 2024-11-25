let submit = document.querySelector(".submit");

submit.addEventListener("click", () => {
    
    const name = document.querySelector(".name").value;
    const email = document.querySelector(".email").value;
    const password = document.querySelector(".password").value;
    console.log(email);
    
    if (name === "" && email === "" && password === "") {
        return alert("Fill your form")
    } else {
        axios.post('http://localhost:7000/signup',{
            fullName:name,
            email:email,
            password:password
        })
            .then(function (res) {
                if (res.data.message === "User registered successfully") {
                    console.log(res.data.message);
                    alert(res.data.message);
                    window.location.href = "http://localhost:7000/login.html";
                } else {
                    alert(res.data)
                    console.log(res.data)
                }
            })
            .catch(function (error) {
                console.log(error);
            })

        }
})
