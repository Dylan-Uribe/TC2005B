
let myEmail = "santander@gmail.com";
let myPassword = "123456";

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    login();
});

function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (email === myEmail && password === myPassword) {
        location.href = "page1.html";
    }
}