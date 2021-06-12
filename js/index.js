$(document).ready(function() {
    sessionStorage.clear();
});

"use strict";
const { Input, Space } = antd;
ReactDOM.render(
    React.createElement(Space, { direction: "vertical" },
        React.createElement("h1", null, "Signin System"),
        React.createElement(Input, { placeholder: "Username", id: "usernameInput" }),
        React.createElement(Input.Password, { placeholder: "Password", id: "passwordInput" }),
        React.createElement("button", { id: "loginButton", className: "enter" }, "login")),
    document.getElementById('login')
);

$('#loginButton').click(function() {
    $.getJSON('data/user.json', function (data) {
        let userList = data;
        let username = $('#usernameInput').val();
        let password = md5($('#passwordInput').val());
        for (let i=0;i<data.length;i++) {
            if(userList[i]['name'] === username && userList[i]['pwd'] === password) {
                let year = new Date().getFullYear();
                let month = new Date().getMonth() + 1;
                let date = new Date().getDate();
                let validTime = year * 10000 + month * 100 + date * 1;
                let level = userList[i]['level'];
                if (validTime < userList[i]['expire'] + 1) {
                    sessionStorage.setItem('user', username);
                    sessionStorage.setItem('level', level);
                    $(location).attr('href', 'main.html');
                } else {
                    alert('User Expired!')
                }
            } else {
                alert('Login Failed!')
            }
        }
    });
});
