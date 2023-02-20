import { popMessage } from "./modal.js";

$(document).ready(function(){
    window.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          register();
        }
      }); 
    $("#submit").click(function(){
        register();
    });
});

function register(){
    let parameter = $("form").serialize();
    if(checkPassword(document.getElementById("password").value,document.getElementById("confirmpassword").value)){
        $.ajax({
            url : "/WordGame/Registration",
            data : parameter,
            type : "post",
            success : function(data){
                console.log(data);
                if(data){
                    popMessage("Registered Successfully");
                    window.location.replace("index.html");
                }
                else{
                    popMessage("Unsuccessfull Registration");
                }
            },
            error : function(err){
                alert('error' + err);
            }
        });
    }
    else{
        popMessage("Invalid password! Try Again");
    }
}

function checkPassword(password,confirmpassword){
    if(password == confirmpassword){
        let pattern = new RegExp(".{8,}");
        if(pattern.test(password)){
            return true
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}
