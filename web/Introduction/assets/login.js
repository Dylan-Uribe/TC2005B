fetch('../data.json')
    .then(response => response.json())
    .then(data => {
        document.getElementById("loginForm").addEventListener("submit", function(event) {
            event.preventDefault();
            login(data);
        });
    });

function login(userData) {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (email === userData.login.username && password === userData.login.password) {
        location.href = "page1.html";
    }
}