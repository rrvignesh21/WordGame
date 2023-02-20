import { ChangePassword,generateRandomWord,getDefinitionOxfordOfWord } from "./ajax.js";

$(document).ready(function () {


    generateRandomWord(5).then(function(data){
        let word = JSON.parse(data);
        console.log(word);
    });

    getDefinitionOxfordOfWord().then(function(data){
        console.log(data);
    })

    
    window.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            verifyPassword();
        }
    });

    $("#submit").click(function () {
        verifyPassword();
    });

    $("#back").click(function () {
        location.replace("myprofile.html");
    });
});

async function verifyPassword() {
    let username = sessionStorage.getItem("username");
    let password = document.getElementById("oldpassword").value;
    if (username == "" | password == "") {
        this.alert("Enter details before submiting");
        return false;
    }
    else {
        let result = await $.ajax({
            url: "../Login",
            data: {
                username: username,
                password: password
            },
            type: 'post',
            success: function (data) {
                if (data == "false") {
                    alert("Invalid password or username");
                }
                else {
                    console.log("Result : " + data);
                    let user = JSON.parse(data);
                    if (user.id > 0) {
                        changePassword();
                    }
                    else {
                        alert("Invalid password or username");
                    }
                }
            },
            error: function () { alert('error'); }

        });
        return result;
    }
}

function changePassword() {
    if (checkPassword(document.getElementById("password").value, document.getElementById("confirmpassword").value)) {
        if (ChangePassword(sessionStorage.getItem("id"), document.getElementById("password").value)) {
            alert("Password Changed.");
            location.replace("myprofile.html");
        }
    }
    else {
        alert("Invalid password! Try Again");
    }
}

function checkPassword(password, confirmpassword) {
    if (password == confirmpassword) {
        let pattern = new RegExp(".{8,}");
        if (pattern.test(password)) {
            return true
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}