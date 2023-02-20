import { resetScore,getProfileData,ChangePassword,setPreference } from "./ajax.js";
import { popMessage,confirmation } from "./modal.js";

$(document).ready(function(){
    console.log(sessionStorage.getItem("id"));
    console.log(sessionStorage.getItem("from"));

    if(sessionStorage.getItem("id") < 0 | sessionStorage.getItem("id") == null){
        alert("You can't access this page 12");
        location.replace("../index.html"); 
    }
    else if(!sessionStorage.getItem("from")){
        alert("You can't access this page 3213245");
        history.back();
    }
    else{
        getProfileData(sessionStorage.getItem("id")).then(function(data){
            data = JSON.parse(data);
            $("#ranking").text(data.rank);
            $("#points").text(data.score);
        });
        if(sessionStorage.getItem("mode")){
            console.log(sessionStorage.getItem("mode"));
            if(sessionStorage.getItem("mode") == 0){
                document.getElementById("dark").click();
                document.getElementById("body").id = "body-dark";
                document.getElementById("mainbox").id = "mainbox-dark";
            }
            else{
                document.getElementById("light").click();
            }
        }

        $("#dark").click(function(){
            console.log("Hello");
            document.getElementById("body").id = "body-dark";
            document.getElementById("mainbox").id = "mainbox-dark";
            setPreference(sessionStorage.getItem("id"),0);
            sessionStorage.setItem("mode",0);
        });

        $("#light").click(function(){
            document.getElementById("body-dark").id = "body";
            document.getElementById("mainbox-dark").id = "mainbox";
            setPreference(sessionStorage.getItem("id"),1);
            sessionStorage.setItem("mode",1);
        });

        $("#name").text(sessionStorage.getItem("username"));

        ((sessionStorage.getItem("adminstatus") == "true")?($("#status").text("Admin")):$("#status").text("Player"));
        $("#changepassword").click(function(){
            $("#passwordchange").modal();
        });

        $("#resetpoints").click(function(){
            confirmation("Do you want to reset your points ?").then(function(confirm){
                if(confirm){
                    resetScore(sessionStorage.getItem("id"));
                }
            });
        });

        $("#submit").click(function(){
            $("#passwordchange").modal('hide');
            verifyPassword();
        });
        
        $("#back").click(function(){
            sessionStorage.removeItem("from");
            window.location.replace("game.html");
        });
    } 
});

async function verifyPassword() {
    let username = sessionStorage.getItem("username");
    let password = document.getElementById("oldpassword").value;
    
    if (username == "" | password == "") {
        popMessage("Enter details before submiting");
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
                let user = JSON.parse(data);
                if (user.id > 0) {
                    changePassword();
                }
                else {
                    $("#password").val("");
                    $("#oldpassword").val("");
                    $("#confirmpassword").val("");
                    popMessage("Invalid Old password");
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
            popMessage("Password Changed successfully!",function(confirm){
                location.reload();                
            });
        }
    }
    else {
        $("#password").val("");
        $("#oldpassword").val("");
        $("#confirmpassword").val("");
        popMessage("Invalid password! Try Again");
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