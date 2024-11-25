let submit = document.querySelector(".submit");

submit.addEventListener("click", () => {
    let confirmpassword = document.querySelector(".confirmpassword").value;
    let password = document.querySelector(".password").value;

    const getTokenFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('token');
    };

    const token = getTokenFromURL();
    if (!token) {
        return alert("Token is missing from the URL");
    }

    if (confirmpassword === "" || password === "") {
        return alert("Please fill in both password fields.");
    }

    if (confirmpassword !== password) {
        return alert("Passwords do not match.");
    }

    axios.post(`http://localhost:7000/resetpassword/?token=${token}`, {
        password: password
    })
        .then(function (res) {
            alert(res.data.message);  
            console.log(res.data);
            if (res.data.message === "Password updated successfully"){
                window.location.href = "http://localhost:7000/login.html"; 
            }
        })
        .catch(function (error) {
            console.error(error);
            alert("An error occurred while resetting the password. Please try again.");
        });
});
