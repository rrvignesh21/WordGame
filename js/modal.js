// Confirmation Pop Message Box
export function confirmation(message) {
    return new Promise(resolve => {
        let modal = $("#confirmation");
        let yesBtn = $("#yes");
        let noBtn = $("#no");
        modal.modal();

        $("#message").text(message);

        yesBtn.click(function(){
            modal.modal('hide');
            resolve(true);
        });

        noBtn.click(function(){
            modal.modal('hide');
            resolve(false);
        });
    });
}

// pop Message
export function popMessage(message,confirm){  
    $("#messages").modal({backdrop: true});
    $("#msg").text(message);
        
    $("#ok").click(function(){
        $("#messages").modal('hide');
        confirm(true);
    });
}

//Modal for get password value
export function getPassword(password){
    $("#passwordchange").modal("show");

    $("#submit").click(function(){
        $("#passwordchange").modal('hide');
        let pswd = $("#password").val();
        $("#password").val("");
        password(pswd);
    });
    
    $("#close").click(function(){
        $("#passwordchange").modal('hide');
    });
}