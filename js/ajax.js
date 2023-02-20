export async function removeUser(id) {
    let result = $.ajax({
        url:"../RemoveUser",
        method:"post",
        data:{
            id : parseInt(id)
        },
        success:function(data) {
            console.log(data);
            if(data){
                return data;
            }
        }
    });

    if(await result == "true"){
        popMessage("Removed User Successfully!!",function(){
            location.reload();
        });
    }
}

export async function setPreference(id,theme) {
    let result = $.ajax({
        url:"../SetPreference",
        method:"post",
        data:{
            id : parseInt(id),
            theme : theme
        },
        success:function(data) {
            console.log(data);
            if(data){
                return data;
            }
        }
    });
    return await result;
}

export async function makeAdmin(id){
    let result = $.ajax({
        url:"../MakeAdmin",
        method:"post",
        data:{
            id : id
        },
        success:function(data) {
            console.log(data);
            if(data){
                return data;
            }
        }
    });

    if(await result == "true"){
        popMessage("Make Admin Successfully!",function(){
            location.reload();
        });
    }
}

export async function revokeAdmin(id){
    let result = $.ajax({
        url:"../RevokeAdmin",
        method:"post",
        data:{
            id : id
        },
        success:function(data) {
            if(data){
                return data;
            }
        }
    });

    if(await result == "true"){
        popMessage("Admin Revoked Successfully!",function(){
            location.reload();
        });
    }
}

export async function ChangePassword(id,password){
    let result = $.ajax({
        url:"../ChangePassword",
        method:"post",
        data:{
            id : id,
            password : password
        },
        success:function(data) {
            console.log(data);
            if(data){
                console.log(data);
                return data;
            }
        }
    });
    return await result;
}

export async function search(mode,value){
    let scores = $.ajax({
        url:"../Search",
        method : "post",
        data : {
            search : mode,
            searchdata : value
        },
        success : function(data) {
            if(data){
                let scores = JSON.parse(data);
                return scores;
            }          
        }
    });
    return await scores;
}

export async function loadScoreBoard(){
    let scores = $.ajax({
        url:"../GetScoreBoard",
        method : "post",
        success : function(data) {
            if(data){
                let scores = JSON.parse(data);
                return scores;
            }          
        }
    });
    return await scores;
}

export async function resetScore(id) {
    let result = $.ajax({
        url:"../ResetScore",
        method:"post",
        data:{
            id : id
        },
        success:function(data) {
            console.log(data);
            if(data){
                return data;
            }
        }
    });

    if(await result == "true"){
        popMessage("Resetted the Score Successfully!!",function(){
            location.reload();
        });
    }
}

export async function getProfileData(id){
    let data = $.ajax({
        url:"../GetProfileData",
        method : "post",
        data:{
            id : id
        },
        success : function(data) {
            if(data){
                let scores = JSON.parse(data);
                return scores;
            }
        }
    });
    return await data;
}

export async function getUserRoom(id){
    let data = $.ajax({
        url:"../GetUserRoom",
        method : "post",
        data:{
            userid : id
        },
        success : function(data) {
            if(data){
                let roomdata = JSON.parse(data);
                return roomdata;
            }
        }
    });
    return await data;
}

export async function getAllRoom(){
    let data = $.ajax({
        url:"../ListAllRoom",
        method : "post",
        success : function(data) {
            if(data){
                let roomdata = JSON.parse(data);
                return roomdata;
            }
        }
    });
    return await data;
}

export async function deleteRoom(roomid) {
    let result = $.ajax({
        url:"../DeleteRoom",
        method:"post",
        data:{
            roomid : parseInt(roomid)
        },
        success:function(data) {
            console.log(data);
            if(data){
                return data;
            }
        }
    });

    if(await result == "true"){
        popMessage("Room Deleted Successfully!!",function(){
            location.reload();
        });
    }
}

export async function getRoomData(roomid){
    let data = $.ajax({
        url:"../GetRoom",
        method : "post",
        data : {
            roomid : roomid
        },
        success : function(data) {
            if(data){
                let roomdata = JSON.parse(data);
                return roomdata;
            }
        }
    });
    return await data;
}

export async function joinRoom(userid,roomid){
    let data = $.ajax({
        url:"../JoinRoom",
        method : "post",
        data : {
            userid : userid,
            roomid : roomid
        },
        success : function(data) {
            console.log(data);
            if(data){
                console.log(data);
            }
        }
    });
    return await data;
}

export async function loadRoomScoreBoard(roomid){
    let scores = $.ajax({
        url:"../GetRoomLeaderBoard",
        method : "post",
        data : {
            roomid : roomid
        },
        success : function(data) {
            if(data){
                let scores = JSON.parse(data);
                return scores;
            }          
        }
    });
    return await scores;
}

export async function updateScoreRoom(userid,roomid){
    let data = $.ajax({
        url:"../UpdateSroreRoom",
        method : "post",
        data : {
            userid : userid,
            roomid : roomid
        },
        success : function(data) {
            console.log(data);
            if(data){
                console.log(data);
            }
        }
    });
    return await data;
}


export async function createRoom(userid,roomname,word,chances){
    let result = $.ajax({
        url:"../CreateRoom",
        method : "post",
        data : {
            userid : userid,
            roomname : roomname,
            word : word,
            chances : chances
        },
        success : function(data) {
            console.log(data);
            if(data){
                return data;
            }
        }
    });

    return await result;
}

export async function updateWord(roomid,word){
    let result = $.ajax({
        url:"../UpdateWord",
        method : "post",
        data : {
            roomid : roomid,
            word : word,
        },
        success : function(data) {
            console.log(data);
            if(data){
                return data;
            }
        }
    });

    return await result;
}


function popMessage(message,confirm){
    $("#messages").modal();
    $("#msg").text(message);
    $("#ok").click(function(){
        $("#messages").modal('hide');
        confirm(true);
    });
}
 
export async function generateRandomWord(length){
    let result = $.ajax({
        url:"https://random-word-api.herokuapp.com/word?length="+length,
        method:"GET",
        success : function(data) {
            console.log(data);
            if(data){
                return data;
            }
        }
    });
    return await result;
}

export async function getDefinitionOfWord(word){
    let result = $.ajax({
        url : "../GetWordDefinition",
        method : "POST",
        data: {
            word : word
          },
        success : function(data) {
            console.log(data);
            if(data){
                return data;
            }
        },
        error : function(err){
            console.log(err);
        }
    });
    return await result;
}

export async function logout(){
    let result = $.ajax({
        url : "../Logout",
        method : "POST",
        success : function(data) {
            console.log(data);
            if(data){
                return data;
            }
        },
        error : function(err){
            console.log(err);
        }
    });
    return await result;
}