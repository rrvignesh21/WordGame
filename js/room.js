import { getAllRoom,joinRoom } from "./ajax.js";

let room;

$(document).ready(function(){
        if(sessionStorage.getItem("id") < 0 | sessionStorage.getItem("id") == null){
        alert("You can't access this page");
        location.replace("../index.html"); 
    }
    
    if(sessionStorage.getItem("mode")){
        console.log(sessionStorage.getItem("mode"));
        if(sessionStorage.getItem("mode") == 0){
            document.getElementById("body").id = "body-dark";
        }
    }

    getAllRoom().then(function(data){
        room = JSON.parse(data);
        loadUserRoom(room);
    });

    $("#back").click(function() {
        sessionStorage.removeItem("currentroomid");
        location.replace("../html/game.html");
    });
});

function loadUserRoom(data){
    for(let i = 0 ;i < data.length;i++){
        $("<div class = 'room'>"+
            "<h3>" + data[i]["roomname"] +"</h3>"
        +"<p><label>Chance : <lable>"+ data[i]["chances"] +"</p>"
        +"<p><label>No Of Players : <lable>"+ data[i]["noofplayers"] +"</p>"
        + "<p id = "+ data[i]["roomid"] +"room></p>"
        +"</div>").appendTo("#rooms");

        if(data[i]["userid"] != sessionStorage.getItem("id")){
            $("<button/>",{
                text : "Join",
                class : "btn btn-success",
                click : function(){
                    console.log(sessionStorage.getItem("id"));
                    joinRoom(sessionStorage.getItem("id"),data[i]["roomid"]);
                    sessionStorage.setItem("currentroomid",data[i]["roomid"]);
                    sessionStorage.setItem("currentroomuserid",data[i]["userid"]);
                    sessionStorage.setItem("currentroomname",data[i]["roomname"]);
                    location.replace("../html/game.html");
                }
            }).appendTo("#"+ data[i]["roomid"]+"room");
        }
        
    }
}