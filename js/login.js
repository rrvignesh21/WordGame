import { popMessage } from "./modal.js";

$(document).ready(function(){

    $("#button").click(function(){
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value; 
        login(username,password);
    });

    window.addEventListener("keypress", function(event) {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value; 
        if(event.key == "Enter"){
            login(username,password);
        }
    });
});

function login(username,password){
    if(username == "" | password == ""){
        popMessage("Enter details before submiting");
    }
    else{
        let parameter = $("form").serialize();
        $.ajax({
            url:"../Login",
            data : parameter,
            type:'post',
            success :function(data){
                if(data == "false"){
                    popMessage("Invalid password or username");
                }
                else{
                let user = JSON.parse(data);
                if(user.id > 0){
                    $("#username").val("");
                    $("#password").val("");
                    sessionStorage.setItem("adminstatus", user.adminstatus);
                    sessionStorage.setItem("id",user.id);
                    sessionStorage.setItem("username",user.username);
                    sessionStorage.setItem("mode",user.theme);
                    setTimeout(function() {
                        location.href = "../html/game.html";
                      }, 2000);
                    }
                }
            },
            error : function(){alert('error');}     
        });
    }
}